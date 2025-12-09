import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import {
  LoadingPane,
  MultiColumnList,
  NoValue,
  Pane,
  Row,
} from '@folio/stripes/components';

import useSchedulerTimers from '../hooks/useSchedulerTimers';

const comparators = {
  type: (a, b) => a.type.localeCompare(b.type),
  moduleName: (a, b) => a.moduleName.localeCompare(b.moduleName),
  path: (a, b) => a.routingEntry.pathPattern.localeCompare(b.routingEntry.pathPattern),
  unit: (a, b) => a.routingEntry.unit?.localeCompare(b.routingEntry.unit),
  delay: (a, b) => {
    const aInt = Number.parseInt(a.routingEntry.delay, 10) || 0;
    const bInt = Number.parseInt(b.routingEntry.delay, 10) || 0;
    return aInt - bInt;
  },
  method: (a, b) => {
    const aMethods = a.routingEntry.methods.join(',');
    const bMethods = b.routingEntry.methods.join(',');

    return aMethods.localeCompare(bMethods);
  },
  schedule: (a, b) => {
    const aSchedule = a.routingEntry.schedule?.cron || '';
    const bSchedule = b.routingEntry.schedule?.cron || '';

    return aSchedule.localeCompare(bSchedule);
  },
};

const columnMapping = {
  delay: <FormattedMessage id="ui-developer.schedulerTimers.delay" />,
  id: <FormattedMessage id="ui-developer.schedulerTimers.id" />,
  method: <FormattedMessage id="ui-developer.schedulerTimers.method" />,
  path: <FormattedMessage id="ui-developer.schedulerTimers.path" />,
  unit: <FormattedMessage id="ui-developer.schedulerTimers.unit" />,
  schedule: <FormattedMessage id="ui-developer.schedulerTimers.schedule" />,
};

const formatter = {
  type: o => o.type,
  moduleName: o => o.moduleName,
  method: o => o.routingEntry.methods.join(', '),
  path: o => o.routingEntry.pathPattern,
  unit: o => o.routingEntry.unit ?? <NoValue />,
  delay: o => (o.routingEntry.delay ? <FormattedNumber value={o.routingEntry.delay} /> : <NoValue />),
  schedule: o => (o.routingEntry.schedule ? <tt>{o.routingEntry.schedule.cron}, {o.routingEntry.schedule.zone}</tt> : <NoValue />),
};

const SchedulerTimers = () => {
  const { data, isLoading } = useSchedulerTimers();
  const [dataSort, setDataSort] = useState({ field: 'moduleName', direction: 'ascending' });

  const onHeaderClick = (_e, m) => {
    setDataSort(prevState => {
      if (prevState.field === m.name) {
        return {
          field: m.name,
          direction: prevState.direction === 'ascending' ? 'descending' : 'ascending',
        };
      }

      return {
        field: m.name,
        direction: 'ascending',
      };
    });
  };

  if (isLoading) return <LoadingPane />;

  const sortedData = () => {
    const list = data.timerDescriptors.toSorted(comparators[dataSort.field]);
    return dataSort.direction === 'ascending' ? list : list.reverse();
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.schedulerTimers" />}
    >
      <Row>
        <MultiColumnList
          columnMapping={columnMapping}
          contentData={sortedData()}
          formatter={formatter}
          visibleColumns={['moduleName', 'type', 'unit', 'delay', 'schedule', 'method', 'path']}
          showSortIndicator
          sortableFields={['moduleName', 'type', 'unit', 'delay', 'schedule', 'method', 'path']}
          onHeaderClick={onHeaderClick}
          interactive={false}
          sortDirection={dataSort.direction}
          sortedColumn={dataSort.field}
        />
      </Row>
    </Pane>
  );
};

SchedulerTimers.propTypes = {
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
    })
  }).isRequired,
};

export default SchedulerTimers;
