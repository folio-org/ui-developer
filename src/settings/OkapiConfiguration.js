import { merge } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Col, Row, TextField, MultiColumnList } from '@folio/stripes/components';
import { ConfigForm } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';
import OkapiConfigurationDisplay from './OkapiConfigurationDisplay';

class OkapiConfiguration extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    stripes: stripesShape.isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    entries: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=!{moduleName} and configName=!{configName})',
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
    },
  });

  render() {
    const entries = (this.props.resources.entries || {}).records || [];

    if (entries.length) {
      return <OkapiConfigurationDisplay entries={entries} />;
    } else {
      return <div>Loading configurations...</div>;
    }
  }
}

export default OkapiConfiguration;
