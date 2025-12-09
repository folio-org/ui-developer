import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useQueryState, parseAsString, parseAsStringLiteral } from 'nuqs';

import {
  LoadingPane,
  MultiColumnList,
  NoValue,
  Pane,
  Row,
} from '@folio/stripes/components';

import useSchedulerTimers from '../hooks/useSchedulerTimers';

const comparators = {
  delay: (a, b) => {
    const aInt = Number.parseInt(a.routingEntry.delay, 10) || 0;
    const bInt = Number.parseInt(b.routingEntry.delay, 10) || 0;
    return aInt - bInt;
  },
  id: (a, b) => a.id.localeCompare(b.id),
  method: (a, b) => {
    const aMethods = a.routingEntry.methods.join(',');
    const bMethods = b.routingEntry.methods.join(',');

    return aMethods.localeCompare(bMethods);
  },
  // moduleName: (a, b) => a.moduleName.localeCompare(b.moduleName),
  path: (a, b) => a.routingEntry.pathPattern.localeCompare(b.routingEntry.pathPattern),
  schedule: (a, b) => {
    const aSchedule = a.routingEntry.schedule?.cron || '';
    const bSchedule = b.routingEntry.schedule?.cron || '';

    return aSchedule.localeCompare(bSchedule);
  },
  type: (a, b) => a.type.localeCompare(b.type),
  unit: (a, b) => a.routingEntry.unit?.localeCompare(b.routingEntry.unit),
};

const SchedulerTimers = () => {
  const { data, isLoading } = useSchedulerTimers();
  const [sortField, setSortField] = useQueryState('sortField',
    parseAsString.withOptions({
      defaultValue: 'moduleName',
      history: 'push'
    }));
  const [sortDirection, setSortDirection] = useQueryState('sortDirection',
    parseAsStringLiteral(['ascending', 'descending']).withOptions({
      defaultValue: 'ascending',
      history: 'push'
    }));

  const columnMapping = {
    delay: <FormattedMessage id="ui-developer.schedulerTimers.delay" />,
    id: <FormattedMessage id="ui-developer.schedulerTimers.id" />,
    method: <FormattedMessage id="ui-developer.schedulerTimers.method" />,
    moduleName: <FormattedMessage id="ui-developer.schedulerTimers.moduleName" />,
    path: <FormattedMessage id="ui-developer.schedulerTimers.path" />,
    schedule: <FormattedMessage id="ui-developer.schedulerTimers.schedule" />,
    type: <FormattedMessage id="ui-developer.schedulerTimers.type" />,
    unit: <FormattedMessage id="ui-developer.schedulerTimers.unit" />,
  };

  const formatter = {
    delay: o => (o.routingEntry.delay ? <FormattedNumber value={o.routingEntry.delay} /> : <NoValue />),
    method: o => o.routingEntry.methods.join(', '),
    path: o => o.routingEntry.pathPattern,
    schedule: o => (o.routingEntry.schedule ? <tt>{o.routingEntry.schedule.cron}, {o.routingEntry.schedule.zone}</tt> : <NoValue />),
    unit: o => o.routingEntry.unit ?? <NoValue />,
  };

  const onHeaderClick = (_e, m) => {
    setSortField(m.name);
    setSortDirection(prevState => {
      if (sortField === m.name) {
        return prevState === 'ascending' ? 'descending' : 'ascending';
      }
      return 'ascending';
    });
  };

  const sortedData = () => {
    const list = data.timerDescriptors.toSorted(comparators[sortField]);
    return sortDirection === 'ascending' ? list : list.reverse();
  };

  if (isLoading) return <LoadingPane />;

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
          visibleColumns={['id', 'moduleName', 'type', 'unit', 'delay', 'schedule', 'method', 'path']}
          showSortIndicator
          sortableFields={['id', 'moduleName', 'type', 'unit', 'delay', 'schedule', 'method', 'path']}
          onHeaderClick={onHeaderClick}
          interactive={false}
          sortDirection={sortDirection}
          sortedColumn={sortField}
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
