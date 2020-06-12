import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import OkapiConfigurationDisplay from './OkapiConfigurationDisplay';

class OkapiConfiguration extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    resources: PropTypes.shape({
      entries: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.object,
      recordId: PropTypes.object,
    }),
  };

  static manifest = Object.freeze({
    recordId: {},
    entries: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries',
      GET: {
        path: 'configurations/entries',
        params: {
          query: 'cql.allRecords=1 sortby module configName code',
          limit: '1000',
        },
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
      DELETE: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });


  handleDelete = (item) => {
    const message = this.props.intl.formatMessage({ id: 'ui-developer.okapiConfigurationEntries.confirm' }, {
      module: item.module,
      configName: item.configName,
      code: item.code,
      value: item.value,
    });

    if (confirm(message)) {
      this.props.mutator.recordId.replace(item.id);
      this.props.mutator.entries.DELETE(item);
    }
  }

  handleUpdate = (item) => {
    this.props.mutator.recordId.replace(item.id);
    this.props.mutator.entries.PUT(item);
  }

  render() {
    const entries = (this.props.resources.entries || {}).records || [];

    if (entries.length) {
      return <OkapiConfigurationDisplay
        entries={entries}
        handleDelete={this.handleDelete}
        handleUpdate={this.handleUpdate}
      />;
    } else {
      return <div><FormattedMessage id="ui-developer.okapiConfigurationEntries.loading" /></div>;
    }
  }
}

export default injectIntl(OkapiConfiguration);
