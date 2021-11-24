import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes, useOkapiKy } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import css from './OkapiConsole.css';


function OkapiConsole() {
  const [version, setVersion] = useState();
  const stripes = useStripes();
  const { okapi } = stripes;
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy('_/version').then(async res => {
      const text = await res.text();
      setVersion(text);
    });
  }, [okapiKy]);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.okapiConsole" />}
    >
      <h3>Okapi version {version}</h3>
      <table className={css.keyValueTable}>
        <tbody>
          <tr>
            <td><FormattedMessage id="ui-developer.okapiConsole.url" /></td>
            <td><code>{okapi.url}</code></td>
          </tr>
          <tr>
            <td><FormattedMessage id="ui-developer.okapiConsole.tenant" /></td>
            <td><code>{okapi.tenant}</code></td>
          </tr>
          <tr>
            <td><FormattedMessage id="ui-developer.okapiConsole.user" /></td>
            <td>
              <code>{okapi.currentUser.username}</code>
              {' '}
              ({okapi.currentUser.firstName}
              {' '}
              {okapi.currentUser.lastName})
            </td>
          </tr>
          <tr>
            <td><FormattedMessage id="ui-developer.okapiConsole.locale" /></td>
            <td><code>{okapi.locale}</code></td>
          </tr>
        </tbody>
      </table>
    </Pane>
  );
}


export default OkapiConsole;
