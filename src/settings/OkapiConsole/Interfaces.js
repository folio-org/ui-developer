import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes, useOkapiKy } from '@folio/stripes/core';
import { Loading, Checkbox } from '@folio/stripes/components';
import Error from './Error';
import KeyValueList from './KeyValueList';


function Interfaces() {
  const [includeSystem, setIncludeSystem] = useState(false);
  const [data, setData] = useState();
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

  if (error) return <Error error={error} />;
  if (!data) return <Loading />;

  const dataList = JSON.parse(data)
    .filter(e => includeSystem || !e.id.startsWith('_'))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map(e => [e.id, e.version]);

  return (
    <>
      <Checkbox
        checked={includeSystem}
        data-test-checkbox-include-system-interfaces
        label={<FormattedMessage id="ui-developer.okapiConsole.interfaces.includeSystem" />}
        onChange={e => setIncludeSystem(e.target.checked)}
      />
      <KeyValueList dataList={dataList} />;
    </>
  );
}


export default Interfaces;
