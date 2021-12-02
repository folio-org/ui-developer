import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes, useOkapiKy } from '@folio/stripes/core';
import { Loading, Checkbox } from '@folio/stripes/components';
import Error from './Error';
import css from './OkapiConsole.css';


function Interfaces() {
  const [includeSystem, setIncludeSystem] = useState(false);
  const [data, setData] = useState();
  const [providers, setProviders] = useState();
  const [error, setError] = useState();
  const stripes = useStripes();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy(`_/proxy/tenants/${stripes.okapi.tenant}/interfaces`).then(async res => {
      setData(await res.text());
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  useEffect(() => {
    // There is no way to get `/_/interfaces` to return information
    // about what modules provide the interfaces, so we get it from
    // here instead and invert it.
    okapiKy('_/proxy/modules?latest=1&full=true').then(async res => {
      const full = JSON.parse(await res.text());
      const register = {};
      full.forEach(module => {
        if (module.provides) {
          module.provides.forEach(iface => {
            const s = `${iface.id}/${iface.version}`;
            if (register[s]) {
              register[s].push(module);
            } else {
              register[s] = [module];
            }
          });
        }
      });
      setProviders(register);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (error) return <Error error={error} />;
  if (!data || !providers) return <Loading />;

  const dataList = JSON.parse(data)
    .filter(e => includeSystem || !e.id.startsWith('_'))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  return (
    <>
      <Checkbox
        checked={includeSystem}
        data-test-checkbox-include-system-interfaces
        label={<FormattedMessage id="ui-developer.okapiConsole.interfaces.includeSystem" />}
        onChange={e => setIncludeSystem(e.target.checked)}
      />
      <h4>
        <FormattedMessage
          id="ui-developer.okapiConsole.interfaces.count"
          values={{ count: dataList.length }}
        />
      </h4>
      <table className={css.interfaceTable}>
        <thead>
          <tr>
            {/* eslint-disable jsx-a11y/control-has-associated-label */}
            <th><FormattedMessage id="ui-developer.okapiConsole.interfaces.id" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.interfaces.version" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.interfaces.providers" /></th>
            {/* eslint-enable jsx-a11y/control-has-associated-label */}
          </tr>
        </thead>
        <tbody>
          {dataList.map(({ id, version }) => {
            const s = `${id}/${version}`;
            return (
              <tr key={s}>
                <td>
                  {id}
                </td>
                <td>
                  {version}
                </td>
                <td>
                  {(providers[s] || []).map(m => m.id).join(', ')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}


export default Interfaces;
