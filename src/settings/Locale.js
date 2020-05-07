import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Button,
  List,
} from '@folio/stripes/components';

const Locale = (props) => {
  const locales = [
    { value: 'ar-AR', label: <FormattedMessage id="ui-developer.sessionLocale.ar-AR" /> },
    { value: 'zh-CN', label: <FormattedMessage id="ui-developer.sessionLocale.zh-CN" /> },
    { value: 'zh-TW', label: <FormattedMessage id="ui-developer.sessionLocale.zh-TW" /> },
    { value: 'da-DK', label: <FormattedMessage id="ui-developer.sessionLocale.da-DK" /> },
    { value: 'en-GB', label: <FormattedMessage id="ui-developer.sessionLocale.en-GB" /> },
    { value: 'en-SE', label: <FormattedMessage id="ui-developer.sessionLocale.en-SE" /> },
    { value: 'en-US', label: <FormattedMessage id="ui-developer.sessionLocale.en-US" /> },
    { value: 'fr-FR', label: <FormattedMessage id="ui-developer.sessionLocale.fr-FR" /> },
    { value: 'de-DE', label: <FormattedMessage id="ui-developer.sessionLocale.de-DE" /> },
    { value: 'he', label: <FormattedMessage id="ui-developer.sessionLocale.he" /> },
    { value: 'hu-HU', label: <FormattedMessage id="ui-developer.sessionLocale.hu-HU" /> },
    { value: 'ja', label: <FormattedMessage id="ui-developer.sessionLocale.ja" /> },
    { value: 'it-IT', label: <FormattedMessage id="ui-developer.sessionLocale.it-IT" /> },
    { value: 'pt-BR', label: <FormattedMessage id="ui-developer.sessionLocale.pt-BR" /> },
    { value: 'pt-PT', label: <FormattedMessage id="ui-developer.sessionLocale.pt-PT" /> },
    { value: 'ru', label: <FormattedMessage id="ui-developer.sessionLocale.ru" /> },
    { value: 'es', label: <FormattedMessage id="ui-developer.sessionLocale.es" /> },
    { value: 'es-419', label: <FormattedMessage id="ui-developer.sessionLocale.es-419" /> },
    { value: 'es-ES', label: <FormattedMessage id="ui-developer.sessionLocale.es-ES" /> },
    { value: 'ur', label: <FormattedMessage id="ui-developer.sessionLocale.ur" /> },
  ];


  const setLocale = (locale) => {
    if (locale) props.stripes.setLocale(locale.value);
  };

  const itemFormatter = (locale) => {
    return <li key={locale.value}><Button onClick={() => setLocale(locale)}>{locale.label}</Button></li>;
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.sessionLocale.temporarySessionLocale" />}
    >
      <List
        listStyle="bullets"
        itemFormatter={itemFormatter}
        items={locales}
      />
    </Pane>
  );
};

Locale.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default Locale;
