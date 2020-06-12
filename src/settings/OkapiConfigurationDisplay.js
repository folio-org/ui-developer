import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { MultiColumnList, Pane, Row, Select } from '@folio/stripes/components';

const OkapiConfigurationDisplay = (props) => {
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  const handleModuleChange = (e) => {
    setFilter(e.target.value);
  };

  const formatter = {
    value: o => o.value, // <JSONPretty data={o.value} />
    // action: (o) => (
    //   <Button onClick={() => props.handleDelete(o)}>
    //     <Icon icon="trash">
    //       <FormattedMessage id="stripes-smart-components.settings.common.delete" />
    //     </Icon>
    //   </Button>
    // ),
  };

  const modules = [...new Set(props.entries.map(e => e.module))].map(o => ({ label: o, value: o }));
  modules.unshift({ label: intl.formatMessage({ id: 'ui-developer.okapiConfigurationEntries.filterByModule.noFilter' }), value: '' });
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
};

OkapiConfigurationDisplay.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  // handleDelete: PropTypes.func,
  // handleUpdate: PropTypes.func,
};

export default OkapiConfigurationDisplay;
