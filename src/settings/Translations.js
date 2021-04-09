import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';

function renderTranslation(t) {
  if (typeof t === 'string') {
    return <b>{t}</b>;
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
          <li>
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
