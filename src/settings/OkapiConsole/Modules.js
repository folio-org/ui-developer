import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes, useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import css from './OkapiConsole.css';


function Modules() {
  const [modules, setModules] = useState();
  const [enabled, setEnabled] = useState();
  const [error, setError] = useState();
  const stripes = useStripes();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy('_/proxy/modules?latest=1').then(async res => {
      const text = await res.text();
      setModules(text);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  useEffect(() => {
    okapiKy(`_/proxy/tenants/${stripes.okapi.tenant}/modules`).then(async res => {
      const text = await res.text();
      setEnabled(text);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (error) {
    return (
      <>
        <h4>{error.summary}</h4>
        <p>{error.detail}</p>
      </>
    );
  }

  if (!modules || !enabled) return <Loading />;

  const register = {};
  JSON.parse(enabled).forEach(entry => { register[entry.id] = true; });

  const parsed = JSON.parse(modules);
  return (
    <table className={css.moduleTable}>
      <thead>
        <tr>
          <th><FormattedMessage id="ui-developer.okapiConsole.modules.module" /></th>
          <th><FormattedMessage id="ui-developer.okapiConsole.modules.version" /></th>
          <th><FormattedMessage id="ui-developer.okapiConsole.modules.description" /></th>
          <th><FormattedMessage id="ui-developer.okapiConsole.modules.enabled" /></th>
        </tr>
      </thead>
      <tbody>
        {parsed.map(({ id, name }) => {
          const m = id.match(/(.*?)-(\d.*)/);
          const [, module, version] = m;
          return (
            <tr key={id}>
              <td>
                {module}
              </td>
              <td>
                {version}
              </td>
              <td>
                {name}
              </td>
              <td>
                {register[id] ? 'Y' : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


export default Modules;
