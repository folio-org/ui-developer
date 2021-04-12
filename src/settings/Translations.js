import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';

function renderArray(a) {
  // types gleaned from manually inspecting AST values in the console.
  // this is totally unscientific, but seems to be accurate-ish.
  // do you wanna know what 3-7 are? Yeah, me too.
  const TYPES = {
    // simple values without placeholders, e.g. foo
    CONSTANT: 0,

    // placeholders for strings, e.g. {foo}
    PLACEHOLDER: 1,

    // placeholders with types, e.g. {foo, number}
    TYPED_PLACEHOLDER: 2,

    // html elements, e.g. <strong>foo</strong>
    HTML_ELEMENT: 8,
  };

  return a.map(t => {
    let str;
    switch (t.type) {
      case TYPES.PLACEHOLDER:
      case TYPES.TYPED_PLACEHOLDER:
        str = `{${t.value}}`;
        break;
      case TYPES.HTML_ELEMENT:
        str = `<${t.value}>${renderArray(t.children)}</${t.value}>`;
        break;
      case TYPES.CONSTANT:
      default:
        str = t.value;
        break;
    }
    return str;
  }).join('');
}

/**
 * Raw translation values, i.e. those from .json files, are simple strings.
 * If the file has been transformed into an AST, the value will be an array;
 * such values are naively un-AST-ified in a manner that seems to work so far.
 *
 * @see https://formatjs.io/docs/guides/advanced-usage#pre-compiling-messages
 *
 * @param {*} t a translation value; maybe a string, maybe an array
 * @returns string
 */
function renderTranslation(t) {
  if (typeof t === 'string') {
    return <b>{t}</b>;
  }

  if (Array.isArray(t)) {
    return <b>{(t.length === 1) ? t[0].value : renderArray(t)}</b>;
  }

  return `[${typeof t}]`;
}

const Translations = ({ stripes }) => {
  const { translations } = stripes.okapi;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.translations" />}
    >
      <ul>
        {Object.keys(translations).sort().map(key => (
          <li key={key}>
            {key}
            {': '}
            {renderTranslation(translations[key])}
          </li>
        ))}
      </ul>
    </Pane>
  );
};

Translations.propTypes = {
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      translations: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Translations;
