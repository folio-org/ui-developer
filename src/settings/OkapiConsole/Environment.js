import React, { useState, useEffect } from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import KeyValueList from './KeyValueList';


function Environment() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy('_/env').then(async res => {
      const text = await res.text();
      setData(text);
    }).catch(async e => {
      setError({ summary: e.toString(), detail: await e.response.text() });
    });
  },
  // ESLint wants okapiKy to be included as a dependency in the array
  // on the next non-comment line. For reasons that I do not
  // understand, including it causes useEffect to fire repeatedly,
  // re-issuing the failed request over and over.
  //
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

  // XXX In future we could add facilities for adding, editing and removing entries
  // But for now, listing is sufficient
  return <KeyValueList dataList={parsed.map(e => [e.name, e.value])} />;
}


export default Environment;
