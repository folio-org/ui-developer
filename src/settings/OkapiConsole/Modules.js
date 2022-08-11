import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStripes, IfPermission, useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { Loading, Row, Col, Checkbox, Button, ConfirmationModal } from '@folio/stripes/components';
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


function undeploy(okapiKy, callout, id, instId) {
  return okapiKy.delete(`_/discovery/modules/${id}/${instId}`)
    .then(() => {
      callout.sendCallout({
        message: <FormattedMessage
          id="ui-developer.okapiConsole.modules.deployments.undeploy.success"
          values={{ id, instId }}
        />
      });
    })
    .catch(err => {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: <FormattedMessage
          id="ui-developer.okapiConsole.modules.deployments.undeploy.error"
          values={{ id, instId, error: err.toString() }}
        />
      });
    });
}


function ModuleDeployments({ id, deployments, forceRender }) {
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const [confirming, setConfirming] = useState();

  return (
    <>
      <h6>
        <FormattedMessage
          id="ui-developer.okapiConsole.modules.deployments"
          values={{ count: deployments.length }}
        />
      </h6>
      <ul>
        {deployments.map(d => (
          <li key={d.instId}>
            {d.instId}
            <br />
            <b>{d.url}</b>
            {d.descriptor?.dockerImage && (
              <>
                <br />
                <span style={{ color: 'grey' }}>
                  Docker: {d.descriptor?.dockerImage}
                </span>
              </>
            )}
            <IfPermission perm="okapi.discovery.delete">
              <br />
              <Button
                style={{ marginTop: '0.5em', marginLeft: '1em' }}
                onClick={() => setConfirming(d.instId)}
              >
                <FormattedMessage id="ui-developer.okapiConsole.modules.deployments.undeploy" />
              </Button>
              {confirming && (
                <ConfirmationModal
                  open
                  heading={<FormattedMessage id="ui-developer.okapiConsole.modules.deployments.undeploy.confirm" />}
                  onConfirm={() => { setConfirming(false); undeploy(okapiKy, callout, id, d.instId).then(forceRender); }}
                  onCancel={() => setConfirming(false)}
                />
              )}
            </IfPermission>
          </li>
        ))}
      </ul>
    </>
  );
}


ModuleDeployments.propTypes = {
  id: PropTypes.string.isRequired,
  deployments: PropTypes.arrayOf(
    PropTypes.shape({
      instId: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      descriptor: PropTypes.shape({
        dockerImage: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
  forceRender: PropTypes.func.isRequired,
};


function ModuleDetail({ detail, deployments, forceRender }) {
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
      <ModuleDeployments id={id} deployments={deployments} forceRender={forceRender} />
    </div>
  );
}


ModuleDetail.propTypes = {
  detail: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  deployments: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
  forceRender: PropTypes.func.isRequired,
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

  const [restrictToLatest, setRestrictToLatest] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [modules, setModules] = useState();
  const [srvc2deployments, setSrvc2deployments] = useState();
  const [register, setRegister] = useState();
  const [detailsVisible, setDetailsVisible] = useState({});
  const [error, setError] = useState();
  const [booleanToForceReRender, setBooleanToForceReRender] = useState();

  const stripes = useStripes();
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  useEffect(() => {
    const url = `_/proxy/modules?full=true${restrictToLatest ? '&latest=1' : ''}`;
    okapiKy(url).then(async res => {
      setModules(await res.text());
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [restrictToLatest]);

  useEffect(() => {
    okapiKy('_/discovery/modules').then(async res => {
      const text = await res.text();
      const tmp = {};
      JSON.parse(text).forEach(entry => {
        if (!tmp[entry.srvcId]) tmp[entry.srvcId] = [];
        tmp[entry.srvcId].push(entry);
      });
      setSrvc2deployments(tmp);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [booleanToForceReRender]);

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
  if (!modules || !srvc2deployments || !register) return <Loading />;

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
      <Row>
        <Col xs={6}>
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
        </Col>
        <Col xs={6}>
          <Checkbox
            checked={restrictToLatest}
            data-test-checkbox-show-description
            label={<FormattedMessage id="ui-developer.okapiConsole.modules.restrictToLatest" />}
            onChange={e => setRestrictToLatest(e.target.checked)}
          />
          <hr />
          <Checkbox
            checked={showDesc}
            data-test-checkbox-show-description
            label={<FormattedMessage id="ui-developer.okapiConsole.modules.showDescription" />}
            onChange={e => setShowDesc(e.target.checked)}
          />
        </Col>
      </Row>

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
                    {(srvc2deployments[id] || []).map(x => x.url).join(', ')}
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
                      <ModuleDetail
                        detail={detail}
                        deployments={srvc2deployments[id] || []}
                        forceRender={() => setBooleanToForceReRender(!booleanToForceReRender)}
                      />
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
