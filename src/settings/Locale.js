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
  // intl instance with locale derived from context, i.e. the session's locale
  const intl = useIntl();

  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  // iterate through the locales list to build an array of { value, label } objects
  const locales = supportedLocales.map(l => {
    // intl instance with locale of current iteree
    const lIntl = createIntl({ locale: l, messages: {} }, cache);

    return {
      value: l,
      // label contains language in context's locale and in iteree's locale
      // e.g. given the context's locale is `en` and the keys `ar` and `zh-CN` show:
      //     Arabic / العربية
      //     Chinese (China) / 中文（中国）
      // e.g. given the context's locale is `ar` and the keys `ar` and `zh-CN` show:
      //    العربية / العربية
      //    الصينية (الصين) / 中文（中国）
      label: `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`,
    };
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
