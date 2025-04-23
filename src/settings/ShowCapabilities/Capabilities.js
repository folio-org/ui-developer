import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useChunkedCQLFetch } from '@folio/stripes/core';

import { APPLICATIONS_STEP_SIZE, displayList } from './Utils';

const Capabilities = (query) => {

  const chunkedCapabilitiesReducer = (data) => {
    return data.flatMap(d => d.data?.capabilities || []);
  };

  const {
    isFetching,
    isLoading,
    items: capabilitiesResults
  } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    idName: 'permission',
    ids: query.query?.length ? query.query : [],
    queryEnabled: query?.length,
    reduceFunction: chunkedCapabilitiesReducer,
    STEP_SIZE: APPLICATIONS_STEP_SIZE,
  });

  return (
    <>
      { !isLoading && capabilitiesResults?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
      { !isLoading && displayList(capabilitiesResults, 'capabilities') }
    </>
  );


};

export default Capabilities;
