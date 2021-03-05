import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { HorizontalBar } from 'react-chartjs-2';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane, Pane } from '@folio/stripes/components';


// By inspection, module type can be determined from ID. Four types:
//      /folio_(.*)-([0-9].)*/    UI module $1, version $2
//      /mod-(.*)-([0-9].)*/      Back-end module $1, version $2
//      /edge-(.*)-([0-9].)*/     Edge module $1, version $2
//      /(.*)-([0-9].)*/          Other module $1, version $2 -- e.g. okapi

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
        height={records.length * 15}
        data={data}
        options={options}
      />
    </>
  );
}

const Dependencies = ({ resources }) => {
  const { modules } = resources;
  const intl = useIntl();

  if (!modules.hasLoaded) return <LoadingPane />;

  const lcn = (x) => x.name.toLowerCase();
  modules.records.sort((a, b) => (lcn(a) < lcn(b) ? -1 : lcn(a) > lcn(b) ? 1 : 0));

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.dependencies" />}
    >
      {chartModules(intl, modules.records)}
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
