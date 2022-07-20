import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Pane, LoadingPane } from '@folio/stripes/components';

const AppManager = () => {
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
  if (!data) return <LoadingPane />;

  const parsed = JSON.parse(data);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.app-manager" />}
    >
      <pre>
{JSON.stringify(parsed, null, 2)}
      </pre>
    </Pane>
  );
};

export default AppManager;
