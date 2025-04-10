import React, { useState } from 'react';

import { useChunkedCQLFetch } from '@folio/stripes/core';

import { APPLICATIONS_STEP_SIZE, displayList } from './Utils';

const Capabilities = (query) => {

  const {
    isFetching,
    isLoading,
    items: capabilitiesResults
  } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    idName: 'permission',
    ids: query,
    queryEnabled: !!query,
    //reduceFunction: chunkedRolesReducer,
    STEP_SIZE: APPLICATIONS_STEP_SIZE,
  });

  return (
    <>
      { !isLoading && capabilitiesResults.capabilities?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
      { !isLoading && displayList(capabilitiesResults, 'capabilities') }
    </>
  );


};

export default Capabilities;
