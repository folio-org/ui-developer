import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useChunkedCQLFetch } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { APPLICATIONS_STEP_SIZE, displayList } from './Utils';

const Capabilities = (searchQuery) => {
  const chunkedCapabilitiesReducer = (data) => {
    return data.flatMap(d => d.data?.capabilities || []);
  };

  const {
    isLoading,
    items: capabilitiesResults
  } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    idName: 'permission',
    ids: searchQuery.query?.length ? searchQuery.query : [],
    queryEnabled: searchQuery.query?.length,
    reduceFunction: chunkedCapabilitiesReducer,
    STEP_SIZE: APPLICATIONS_STEP_SIZE,
  });

  return (
    <>
      { isLoading && <Loading /> }
      { !isLoading && capabilitiesResults?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
      { !isLoading && displayList(capabilitiesResults, 'capabilities') }
    </>
  );
};

export default Capabilities;
