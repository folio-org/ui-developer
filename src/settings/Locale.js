import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, createIntl, createIntlCache } from 'react-intl';

import {
  Pane,
  Button,
  List,
} from '@folio/stripes/components';

const Locale = (props) => {
  const intl = useIntl();

  const locales = [
    { value: 'ar', label: '' },
    { value: 'zh-CN', label: '' },
    { value: 'zh-TW', label: '' },
    { value: 'da-DK', label: '' },
    { value: 'en-GB', label: '' },
    { value: 'en-SE', label: '' },
    { value: 'en-US', label: '' },
    { value: 'fr-FR', label: '' },
    { value: 'de-DE', label: '' },
    { value: 'he', label: '' },
    { value: 'hu-HU', label: '' },
    { value: 'ja', label: '' },
    { value: 'it-IT', label: '' },
    { value: 'pt-BR', label: '' },
    { value: 'pt-PT', label: '' },
    { value: 'ru', label: '' },
    { value: 'es', label: '' },
    { value: 'es-419', label: '' },
    { value: 'es-ES', label: '' },
    { value: 'ur', label: '' },
  ];

  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  locales.forEach(locale => {
    locale.intl = createIntl({
      locale: locale.value,
      messages: {}
    }, cache);

    // label contains language in current locale and in destination locale
    // e.g. given the current locale is `en` and the keys `ar` and `zh-CN` show:
    //     Arabic / العربية
    //     Chinese (China) / 中文（中国）
    // e.g. given the current locale is `ar` and the keys `ar` and `zh-CN` show:
    //    العربية / العربية
    //    الصينية (الصين) / 中文（中国）
    locale.label = `${intl.formatDisplayName(locale.value)} / ${locale.intl.formatDisplayName(locale.value)}`;
  });

  const setLocale = (locale) => {
    if (locale) props.stripes.setLocale(locale.value);
  };

  const itemFormatter = (locale) => {
    return <li key={locale.value}><Button onClick={() => setLocale(locale)}>{locale.label}</Button></li>;
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={intl.formatMessage({ id: 'ui-developer.sessionLocale.temporarySessionLocale' })}
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
