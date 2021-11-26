import React, { useState, useEffect } from 'react';
import { useStripes, useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import KeyValueList from './KeyValueList';


function Interfaces() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const stripes = useStripes();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy(`_/proxy/tenants/${stripes.okapi.tenant}/interfaces`).then(async res => {
      const text = await res.text();
      setData(text);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (error) {
    return (
      <>
        <h4>{error.summary}</h4>
        <p>{error.detail}</p>
      </>
    );
  }

  if (!data) return <Loading />;
  const parsed = JSON.parse(data);
  const interfaceCmp = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  return <KeyValueList dataList={parsed.sort(interfaceCmp).map(e => [e.id, e.version])} />;
}


export default Interfaces;
