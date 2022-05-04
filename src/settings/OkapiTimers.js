import React from 'react';
import PropTypes from 'prop-types';

import {
  LoadingPane,
  MultiColumnList,
  Pane,
  Row,
} from '@folio/stripes/components';

import useOkapiTimers from '../hooks/useOkapiTimers';

const OkapiTimers = (props) => {
  const { data, isLoading } = useOkapiTimers(props.stripes.okapi.tenant);

  const formatter = {
    method: o => o.routingEntry.methods.join(', '),
    path: o => o.routingEntry.pathPattern,
    unit: o => o.routingEntry.unit,
    delay: o => o.routingEntry.delay,
  };

  if (isLoading) return <LoadingPane />;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle="Okapi timers"
    >
      <Row>
        <MultiColumnList
          contentData={data}
          visibleColumns={['id', 'method', 'path', 'unit', 'delay']}
          formatter={formatter}
        />
      </Row>
    </Pane>
  );
};

OkapiTimers.propTypes = {
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
    })
  }).isRequired,
};

export default OkapiTimers;
