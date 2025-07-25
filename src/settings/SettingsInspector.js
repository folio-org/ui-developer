import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Pane, Loading, MultiColumnList, NoValue } from '@folio/stripes/components';

const SettingsInspector = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy('settings/entries').then(async res => {
      setData(await res.text());
    }).catch(async e => {
      setError(e);
    });
  },
  // ESLint wants okapiKy to be included as a dependency in the array
  // on the next non-comment line. For reasons that I do not
  // understand, including it causes useEffect to fire repeatedly,
  // re-issuing the failed request over and over.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (error) throw Error(error.toString());
  if (!data) return <Loading />;
  const parsed = JSON.parse(data);

  const columns = [
    /*
    {
      name: 'id',
    },
    */
    {
      name: 'scope',
    },
    {
      name: 'key',
    },
    {
      name: 'user',
      formatter: x => x.user || <NoValue />,
    },
    {
      name: 'value',
      formatter: x => JSON.stringify(x.value, null, 2),
    },
  ];

  const columnMapping = {};
  const formatter = {};
  columns.forEach(x => {
    columnMapping[x.name] = <FormattedMessage id={`ui-developer.settingsInspector.col.${x.name}`} />;
    if (x.formatter) formatter[x.name] = x.formatter;
  });

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.settingsInspector" />}
    >
      <h3>
        <FormattedMessage id="ui-developer.settingsInspector.count" values={{ count: parsed.resultInfo?.totalRecords }} />
      </h3>
      <MultiColumnList
        contentData={parsed.items}
        visibleColumns={columns.map(x => x.name)}
        columnMapping={columnMapping}
        formatter={formatter}
      />
    </Pane>
  );
};

export default SettingsInspector;
