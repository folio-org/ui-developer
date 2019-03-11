import React from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
  Button,
  List,
} from '@folio/stripes/components';

const Locale = (props) => {
  const locales = [
    { value: 'ar-AR', label: 'Arabic' },
    { value: 'zh-CN', label: 'Chinese Simplified' },
    { value: 'da-DK', label: 'Danish' },
    { value: 'en-GB', label: 'English - Great Britain' },
    { value: 'en-SE', label: 'English - Sweden' },
    { value: 'en-US', label: 'English - United States' },
    { value: 'de-DE', label: 'German - Germany' },
    { value: 'hu-HU', label: 'Hungarian' },
    { value: 'it-IT', label: 'Italian - Italy' },
    { value: 'pt-BR', label: 'Portuguese - Brazil' },
    { value: 'pt-PT', label: 'Portuguese - Portugal' },
    { value: 'es-ES', label: 'Spanish - Spain' },
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
      paneTitle="TEMPORARY Session locale"
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
