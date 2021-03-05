import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HorizontalBar } from 'react-chartjs-2';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane, Pane } from '@folio/stripes/components';

function chartModules(records) {
  const names = records.map(r => r.name);
  const required = records.map(r => (r.requires || []).length);
  const provided = records.map(r => (r.provides || []).length);

  const data = {
    labels: names,
    datasets: [
      {
        label: '# interfaces required',
        data: required,
        backgroundColor: 'red',
      },
      {
        label: '# interfaces provided',
        data: provided,
        backgroundColor: 'blue',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <p>
        This is a proof of concept for the use of
        {' '}
        <a href="https://www.chartjs.org/">ChartJS</a>,
        and is not necessarily expected to be of much use to anyone. It presents a graph of all currently loaded FOLIO modules, in alphabetical order, showing how many interfaces they require (red) and provide (blue).
      </p>
      <HorizontalBar
        data={data}
        options={options}
      />
      <p>
        <b>
          {records.length} modules:
        </b>
        {records.map(r => r.name).join(', ')}
      </p>
    </>
  );
}

const Charting = ({ resources }) => {
  const { modules } = resources;

  if (!modules.hasLoaded) return <LoadingPane />;

  const lcn = (x) => x.name.toLowerCase();
  modules.records.sort((a, b) => (lcn(a) < lcn(b) ? -1 : lcn(a) > lcn(b) ? 1 : 0));

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.charting" />}
    >
      {chartModules(modules.records)}
    </Pane>
  );
};

Charting.manifest = {
  modules: {
    type: 'okapi',
    path: '_/proxy/tenants/diku/modules',
    params: { full: true },
  },
};

Charting.propTypes = {
  resources: PropTypes.shape({
    modules: PropTypes.object,
  }).isRequired,
};

export default stripesConnect(Charting);
