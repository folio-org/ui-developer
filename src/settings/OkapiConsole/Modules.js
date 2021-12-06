import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStripes, useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { Loading, Checkbox } from '@folio/stripes/components';
import Error from './Error';
import css from './OkapiConsole.css';


function maybeRenderInterfaces(detail, tag, isPermissions) {
  const list = detail[tag];
  if (!list || list.length === 0) return null;

  return (
    <>
      <h6>
        <FormattedMessage
          id={`ui-developer.okapiConsole.modules.${tag}`}
          values={{ count: list.length }}
        />
      </h6>
      <ul>
        {list.map((entry, i) => (
          <li key={i}>
            {isPermissions ?
              <><code>{entry.permissionName}</code> ({entry.displayName})</> :
              <>{entry.id} {entry.version}</>
            }
          </li>
        ))}
      </ul>
    </>
  );
}

function ModuleDetail({ detail }) {
  const { id } = detail;
  const m = id.match(/(.*?)-(\d.*)/);
  const [, module, version] = m;

  return (
    <div className={css.moduleDetail}>
      <h5>
        <FormattedMessage
          id="ui-developer.okapiConsole.modules.detailFor"
          values={{ module, version }}
        />
      </h5>
      {detail.name && <p>{detail.name}</p>}
      {maybeRenderInterfaces(detail, 'requires')}
      {maybeRenderInterfaces(detail, 'optional')}
      {maybeRenderInterfaces(detail, 'provides')}
      {maybeRenderInterfaces(detail, 'permissionSets', true)}
    </div>
  );
}


ModuleDetail.propTypes = {
  detail: PropTypes.object.isRequired,
};


function formatError(intl, id, tag, rawError, rawDetail) {
  let error;
  let detail;

  if (!rawDetail.match(/^ ?Missing dependency/)) {
    error = rawError;
    detail = rawDetail;
  } else {
    error = intl.formatMessage({ id: 'ui-developer.okapiConsole.modules.dependencyError' });
    detail = (
      <ul>
        {rawDetail.split('\n').map((line, key) => <li key={key}>{line.replace(/^ ?Missing dependency: /, '')}</li>)}
      </ul>
    );
  }

  return <FormattedMessage
    id={`ui-developer.okapiConsole.modules.${tag}.failure`}
    values={{ id, error, detail }}
  />;
}


function Modules() {
  const [includeUI, setIncludeUI] = useState(true);
  const [includeBackend, setIncludeBackend] = useState(true);
  const [includeEdge, setIncludeEdge] = useState(true);
  const [includeOther, setIncludeOther] = useState(true);

  const [showDesc, setShowDesc] = useState(false);
  const [modules, setModules] = useState();
  const [srvc2url, setSrvc2url] = useState();
  const [register, setRegister] = useState();
  const [detailsVisible, setDetailsVisible] = useState({});
  const [error, setError] = useState();
  const stripes = useStripes();
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  useEffect(() => {
    okapiKy('_/proxy/modules?latest=1&full=true').then(async res => {
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
      JSON.parse(text).forEach(entry => { tmp[entry.srvcId] = entry.url; });
      setSrvc2url(tmp);
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
  if (!modules || !srvc2url || !register) return <Loading />;

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
        timeout: 0,
        message: formatError(intl, id, enable ? 'enable' : 'disable', e.toString(), await e.response.text()),
      });
    });
  }

  const parsed = JSON.parse(modules);
  const active = [];
  parsed.forEach(module => {
    const { id } = module;
    if ((!includeUI && !includeBackend && !includeEdge && !includeOther) ||
        (includeUI && id.startsWith('folio_')) ||
        (includeBackend && id.startsWith('mod-')) ||
        (includeEdge && id.startsWith('edge-')) ||
        (includeOther && (!id.startsWith('folio_') && !id.startsWith('mod-') && !id.startsWith('edge-')))) {
      active.push(module);
    }
  });

  function togglePopup(id) { setDetailsVisible({ ...detailsVisible, [id]: !detailsVisible[id] }); }

  return (
    <>
      <Checkbox
        checked={includeUI}
        data-test-checkbox-include-ui-modules
        label={<FormattedMessage id="ui-developer.dependencies.ui-modules" />}
        onChange={e => setIncludeUI(e.target.checked)}
      />
      <Checkbox
        checked={includeBackend}
        data-test-checkbox-include-backend-modules
        label={<FormattedMessage id="ui-developer.dependencies.backend-modules" />}
        onChange={e => setIncludeBackend(e.target.checked)}
      />
      <Checkbox
        checked={includeEdge}
        data-test-checkbox-include-edge-modules
        label={<FormattedMessage id="ui-developer.dependencies.edge-modules" />}
        onChange={e => setIncludeEdge(e.target.checked)}
      />
      <Checkbox
        checked={includeOther}
        data-test-checkbox-include-other-modules
        label={<FormattedMessage id="ui-developer.dependencies.other-modules" />}
        onChange={e => setIncludeOther(e.target.checked)}
      />
      <Checkbox
        checked={showDesc}
        data-test-checkbox-show-description
        label={<FormattedMessage id="ui-developer.okapiConsole.modules.showDescription" />}
        onChange={e => setShowDesc(e.target.checked)}
      />
      <h4>
        <FormattedMessage
          id="ui-developer.okapiConsole.modules.count"
          values={{ count: active.length, total: parsed.length }}
        />
      </h4>
      <table className={css.moduleTable}>
        <thead>
          <tr>
            {/* eslint-disable jsx-a11y/control-has-associated-label */}
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.module" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.version" /></th>
            {showDesc &&
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.description" /></th>
            }
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.url" /></th>
            <th><FormattedMessage id="ui-developer.okapiConsole.modules.enabled" /></th>
            {/* eslint-enable jsx-a11y/control-has-associated-label */}
          </tr>
        </thead>
        <tbody>
          {active.map((detail) => {
            const { id, name } = detail;
            const m = id.match(/(.*?)-(\d.*)/);
            const [, module, version] = m;
            return (
              <React.Fragment key={id}>
                <tr>
                  <td>
                    <button
                      type="button"
                      style={{ textAlign: 'left' }}
                      onClick={() => togglePopup(id)}
                    >
                      {module}
                    </button>
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
                    {srvc2url[id]}
                  </td>
                  <td>
                    <Checkbox
                      checked={register[id] || false}
                      onChange={e => enableOrDisable(id, e.target.checked)}
                    />
                  </td>
                </tr>
                {detailsVisible[id] &&
                  <tr>
                    <td colSpan={showDesc ? 5 : 4}>
                      <ModuleDetail detail={detail} />
                    </td>
                  </tr>
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
}


export default Modules;
