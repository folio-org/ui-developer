import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import css from './OkapiConsole.css';


function Parameters() {
  const stripes = useStripes();
  const { okapi } = stripes;

  return (
    <table className={css.keyValueTable}>
      <tbody>
        <tr>
          <td><FormattedMessage id="ui-developer.okapiConsole.parameters.url" /></td>
          <td><code>{okapi.url}</code></td>
        </tr>
        <tr>
          <td><FormattedMessage id="ui-developer.okapiConsole.parameters.tenant" /></td>
          <td><code>{okapi.tenant}</code></td>
        </tr>
        <tr>
          <td><FormattedMessage id="ui-developer.okapiConsole.parameters.user" /></td>
          <td>
            <code>{okapi.currentUser.username}</code>
            {' '}
            ({okapi.currentUser.firstName}
            {' '}
            {okapi.currentUser.lastName})
          </td>
        </tr>
        <tr>
          <td><FormattedMessage id="ui-developer.okapiConsole.parameters.locale" /></td>
          <td><code>{okapi.locale}</code></td>
        </tr>
      </tbody>
    </table>
  );
}


export default Parameters;
