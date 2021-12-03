import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import KeyValueList from './KeyValueList';


function Configuration() {
  const stripes = useStripes();
  const { okapi } = stripes;

  return <KeyValueList
    dataList={[
      [
        <FormattedMessage id="ui-developer.okapiConsole.configuration.url" />,
        <code>{okapi.url}</code>
      ],
      [
        <FormattedMessage id="ui-developer.okapiConsole.configuration.tenant" />,
        <code>{okapi.tenant}</code>
      ],
      [
        <FormattedMessage id="ui-developer.okapiConsole.configuration.user" />,
        <>
          <code>{okapi.currentUser.username}</code>
          {' '}
          ({okapi.currentUser.firstName}
          {' '}
          {okapi.currentUser.lastName})
        </>
      ],
      [
        <FormattedMessage id="ui-developer.okapiConsole.configuration.locale" />,
        <code>{okapi.locale}</code>
      ],
    ]}
  />;
}


export default Configuration;
