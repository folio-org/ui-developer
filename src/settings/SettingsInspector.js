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
    {
      name: 'id',
      disabled: true,
      width: 160,
    },
    {
      name: 'scope',
      width: 120,
    },
    {
      name: 'key',
      width: 160,
    },
    {
      width: 80,
      name: 'user',
      formatter: x => x.user || <NoValue />,
    },
    {
      name: 'value',
      // ESLint is too stupid to understand that this function does have a consistent return
      // eslint-disable-next-line consistent-return
      formatter: x => {
        if (typeof x.value === 'object') {
          return <pre>{JSON.stringify(x.value, null, 2)}</pre>;
        } else if (typeof x.value !== 'string') {
          return x.value;
        } else if (x.value.startsWith('{')) {
          // Heuristically, we guess this might be a string-encoded JSON structure
          let parsedVal;
          try {
            parsedVal = JSON.parse(x.value);
          } catch (e) {
            // It's some other kind of string, just display as-is
            return x.value;
          }
          return <pre>{JSON.stringify(parsedVal, null, 2)}</pre>;
        }
      },
    },
  ];

  const columnMapping = {};
  const columnWidths = {};
  const formatter = {};
  columns.forEach(x => {
    columnMapping[x.name] = <FormattedMessage id={`ui-developer.settingsInspector.col.${x.name}`} />;
    if (x.width) columnWidths[x.name] = `${x.width}px`;
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
        visibleColumns={columns.filter(x => !x.disabled).map(x => x.name)}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
      />
    </Pane>
  );
};

export default SettingsInspector;
