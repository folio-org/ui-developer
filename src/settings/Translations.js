import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';

function renderArray(a) {
  return a.map(t => {
    let str;
    switch (t.type) {
      case 1: // placeholders for strings, e.g. {foo}
      case 2: // placeholders with types, e.g. {foo, number}
        str = `{${t.value}}`;
        break;
      case 8: // html elements, e.g. <strong>foo</strong>
        str = `<${t.value}>${renderArray(t.children)}</${t.value}>`;
        break;
      case 0: // simple values without placeholders, e.g. foo
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
 * @param {*} t
 * @returns
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
