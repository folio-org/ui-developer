import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';

import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, Col, MultiColumnList, Pane, Row, Select, TextField } from '@folio/stripes/components';
import { ConfigForm } from '@folio/stripes/smart-components';

const OkapiConfigurationDisplay = (props) => {
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  const handleModuleChange = (e) => {
    setFilter(e.target.value);
  };

  const formatter = {
    value: o => o.value // <JSONPretty data={o.value} />
  };

  const modules = [...new Set(props.entries.map(e => e.module))].map(o => ({ label: o, value: o }));
  modules.unshift({ label: intl.formatMessage({ id: 'ui-developer.okapiConfigurationEntries.noFilter' }), value: '' });
  const filteredEntries = filter ? props.entries.filter(e => e.module === filter) : props.entries;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.okapiConfigurationEntries" />}
    >
      <Row>
        <Select
          name="modules"
          label={<FormattedMessage id="ui-developer.okapiConfigurationEntries.filterByModule" />}
          dataOptions={modules}
          onChange={handleModuleChange}
        />
      </Row>
      <Row>
        <MultiColumnList
          contentData={filteredEntries}
          visibleColumns={['module', 'configName', 'code', 'value']}
          formatter={formatter}
        />
      </Row>
    </Pane>
  );
}

export default OkapiConfigurationDisplay;
