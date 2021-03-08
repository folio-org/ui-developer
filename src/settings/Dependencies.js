import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { HorizontalBar } from 'react-chartjs-2';
import { stripesConnect } from '@folio/stripes/core';
import { Checkbox, LoadingPane, Pane } from '@folio/stripes/components';


function chartModules(intl, records) {
  const names = records.map(r => r.name);
  const required = records.map(r => (r.requires || []).length);
  const provided = records.map(r => (r.provides || []).length);

  const data = {
    labels: names,
    datasets: [
      {
        label: intl.formatMessage({ id: 'ui-developer.dependencies.interfacesRequired' }),
        data: required,
        backgroundColor: 'red',
      },
      {
        label: intl.formatMessage({ id: 'ui-developer.dependencies.interfacesProvided' }),
        data: provided,
        backgroundColor: 'blue',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        title: t => {
          const record = records[t[0].index];
          return `${record.name} (${record.id})`;
        },
        label: t => {
          const record = records[t.index];
          const elementName = ['requires', 'provides'][t.datasetIndex];
          const list = record[elementName] || [];
          const emdash = '—';
          return [
            `${emdash} ${elementName} ${list.length} interfaces ${emdash}`,
            ...list.map(x => `${x.id} v${x.version}`),
          ];
        },
      },
    },
  };

  return (
    <>
      <h3><FormattedMessage id="ui-developer.dependencies.moduleCount" values={{ count: records.length }} /></h3>
      <HorizontalBar
        redraw
        height={records.length * 15}
        data={data}
        options={options}
      />
    </>
  );
}


const Dependencies = ({ resources }) => {
  const intl = useIntl();

  const [includeUI, setIncludeUI] = useState(true);
  const [includeBackend, setIncludeBackend] = useState(true);
  const [includeEdge, setIncludeEdge] = useState(true);
  const [includeOther, setIncludeOther] = useState(true);

  const { modules } = resources;
  if (!modules.hasLoaded) return <LoadingPane />;

  // By inspection, module type can be determined from ID. Four types:
  //      /folio_(.*)-([0-9].)*/    UI module $1, version $2
  //      /mod-(.*)-([0-9].)*/      Back-end module $1, version $2
  //      /edge-(.*)-([0-9].)*/     Edge module $1, version $2
  //      /(.*)-([0-9].)*/          Other module $1, version $2 -- e.g. okapi
  const active = [];
  modules.records.forEach(module => {
    const { id } = module;
    if ((!includeUI && !includeBackend && !includeEdge && !includeOther) ||
        (includeUI && id.startsWith('folio_')) ||
        (includeBackend && id.startsWith('mod-')) ||
        (includeEdge && id.startsWith('edge-')) ||
        (includeOther && (!id.startsWith('folio_') && !id.startsWith('mod-') && !id.startsWith('edge-')))) {
      active.push(module);
    }
  });

  const lcn = (x) => x.name.toLowerCase();
  modules.records.sort((a, b) => (lcn(a) < lcn(b) ? -1 : lcn(a) > lcn(b) ? 1 : 0));

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.dependencies" />}
    >
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
      {chartModules(intl, active)}
      <br />
      <hr />
      <p>
        <b>Note.</b>
        {' '}
        This is a proof of concept for the use of
        {' '}
        <a href="https://www.chartjs.org/">ChartJS</a>,
        and is not necessarily expected to be of much use to anyone. It presents a graph of all currently loaded FOLIO modules, in alphabetical order, showing how many interfaces they require (red) and provide (blue).
      </p>
    </Pane>
  );
};

Dependencies.manifest = {
  modules: {
    type: 'okapi',
    path: '_/proxy/tenants/diku/modules',
    params: { full: true },
  },
};

Dependencies.propTypes = {
  resources: PropTypes.shape({
    modules: PropTypes.object,
  }).isRequired,
};

export default stripesConnect(Dependencies);
