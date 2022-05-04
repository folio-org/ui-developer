import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import {
  LoadingPane,
  MultiColumnList,
  Pane,
  Row,
} from '@folio/stripes/components';

import useOkapiTimers from '../hooks/useOkapiTimers';

const OkapiTimers = (props) => {
  const { data, isLoading } = useOkapiTimers(props.stripes.okapi.tenant);

  const columnMapping = {
    id: <FormattedMessage id="ui-developer.okapiTimers.id" />,
    method: <FormattedMessage id="ui-developer.okapiTimers.method" />,
    path: <FormattedMessage id="ui-developer.okapiTimers.path" />,
    unit: <FormattedMessage id="ui-developer.okapiTimers.unit" />,
    delay: <FormattedMessage id="ui-developer.okapiTimers.delay" />,
  };

  const formatter = {
    method: o => o.routingEntry.methods.join(', '),
    path: o => o.routingEntry.pathPattern,
    unit: o => o.routingEntry.unit,
    delay: o => <FormattedNumber value={o.routingEntry.delay} />,
  };

  if (isLoading) return <LoadingPane />;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle="Okapi timers"
    >
      <Row>
        <MultiColumnList
          columnMapping={columnMapping}
          contentData={data}
          formatter={formatter}
          visibleColumns={['id', 'unit', 'delay', 'method', 'path']}
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
