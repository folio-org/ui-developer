import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

const Apps = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    okapiKy('app-manager/apps').then(async res => {
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
  const length = Object.keys(parsed).length;

  return (
    <>
      <h2>
        <FormattedMessage
          id="ui-developer.app-manager.apps.count"
          values={{ count: length }}
        />
      </h2>
      {Object.keys(parsed).sort().map((key, index) => (
        <div key={index}>
          <h3>{parsed[key].displayName || parsed[key].name}</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li>
              <b>Description:</b>
              &nbsp;
              {parsed[key].description}
            </li>
            <li>
              <b>Published by:</b>
              &nbsp;
              {parsed[key].publisher}
            </li>
            <li>
              <pre>
                {JSON.stringify(parsed[key], null, 2)}
              </pre>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default Apps;
