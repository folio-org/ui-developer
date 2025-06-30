import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useChunkedCQLFetch } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import { APPLICATIONS_STEP_SIZE, DisplayList } from './Utils';

const CapabilitySets = (searchQuery) => {
  const chunkedCapabilitySetsReducer = (data) => {
    return data.flatMap(d => d.data?.capabilitySets || []);
  };

  const {
    isLoading,
    items: capabilitySetsResults
  } = useChunkedCQLFetch({
    endpoint: 'capability-sets',
    idName: 'permission',
    ids: searchQuery.query?.length ? searchQuery.query : [],
    queryEnabled: searchQuery.query?.length,
    reduceFunction: chunkedCapabilitySetsReducer,
    STEP_SIZE: APPLICATIONS_STEP_SIZE,
  });

  return (
    <>
      { isLoading && <Loading /> }
      { !isLoading && capabilitySetsResults?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilitySets" /></h3> }
      { !isLoading && DisplayList(capabilitySetsResults) }
    </>
  );
};

export default CapabilitySets;
