import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, createIntl, createIntlCache } from 'react-intl';

import {
  Pane,
  Button,
  List,
} from '@folio/stripes/components';
import { supportedLocales } from '@folio/stripes/core';

const Locale = (props) => {
  const intl = useIntl();
  const locales = supportedLocales.map(l => ({ value: l, label: '' }));

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
