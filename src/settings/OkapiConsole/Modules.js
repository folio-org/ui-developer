import React, { useState, useContext, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes, useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { Loading, Checkbox } from '@folio/stripes/components';
import Error from './Error';
import css from './OkapiConsole.css';


function Modules() {
  const [showDesc, setShowDesc] = useState(false);
  const [modules, setModules] = useState();
  const [srvc2node, setSrvc2node] = useState();
  const [register, setRegister] = useState();
  const [error, setError] = useState();
  const stripes = useStripes();
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);

  useEffect(() => {
    okapiKy('_/proxy/modules?latest=1').then(async res => {
      setModules(await res.text());
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  useEffect(() => {
    // This gives us far more detail than we need, but the RAML suggests that are no parameters to prevent this
    okapiKy('_/discovery/modules').then(async res => {
      const text = await res.text();
      const tmp = {};
      JSON.parse(text).forEach(entry => { tmp[entry.srvcId] = entry.nodeId; });
      setSrvc2node(tmp);
      console.log('srvc2node =', tmp);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  useEffect(() => {
    okapiKy(`_/proxy/tenants/${stripes.okapi.tenant}/modules`).then(async res => {
      const text = await res.text();
      const tmp = {};
      JSON.parse(text).forEach(entry => { tmp[entry.id] = true; });
      setRegister(tmp);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (error) return <Error error={error} />;
  if (!modules || !srvc2node || !register) return <Loading />;

  function enableOrDisable(id, enable) {
    const p = enable ?
      okapiKy.post(`_/proxy/tenants/${stripes.okapi.tenant}/modules`, { json: { id } }) :
      okapiKy.delete(`_/proxy/tenants/${stripes.okapi.tenant}/modules/${id}`);

    p.then(async () => {
      setRegister({ ...register, [id]: enable });
      callout.sendCallout({
        message: <FormattedMessage
          id={`ui-developer.okapiConsole.modules.${enable ? 'enable' : 'disable'}.success`}
          values={{ id }}
        />
      });
    }).catch(async e => {
      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage
          id={`ui-developer.okapiConsole.modules.${enable ? 'enable' : 'disable'}.failure`}
          values={{ id, error: e.toString(), detail: await e.response.text() }}
        />
      });
    });
  }

  const parsed = JSON.parse(modules);
  return (
    <>
      <Checkbox
        checked={showDesc}
        data-test-checkbox-show-description
        label={<FormattedMessage id="ui-developer.okapiConsole.modules.showDescription" />}
        onChange={e => setShowDesc(e.target.checked)}
      />
      <table className={css.moduleTable}>
        <thead>
          <tr>
            {/* eslint-disable jsx-a11y/control-has-associated-label */}
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.module" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.version" /></th>
            {showDesc &&
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.description" /></th>
            }
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.node" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.enabled" /></th>
            {/* eslint-enable jsx-a11y/control-has-associated-label */}
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
                {showDesc &&
                <td>
                  {name}
                </td>
                }
                <td>
                  {srvc2node[id]}
                </td>
                <td>
                  <Checkbox
                    checked={register[id] || false}
                    onChange={e => enableOrDisable(id, e.target.checked)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}


export default Modules;
