import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { HorizontalBar } from 'react-chartjs-2';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane, Pane } from '@folio/stripes/components';

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
      <h3><FormattedMessage id="ui-developer.dependencies.moduleCount" values={{ count: records.length }} /></h3>
      <HorizontalBar
        height={records.length * 15}
        data={data}
        options={options}
      />
      <p>
        <b>Note.</b>
        {' '}
        This is a proof of concept for the use of
        {' '}
        <a href="https://www.chartjs.org/">ChartJS</a>,
        and is not necessarily expected to be of much use to anyone. It presents a graph of all currently loaded FOLIO modules, in alphabetical order, showing how many interfaces they require (red) and provide (blue).
      </p>
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
