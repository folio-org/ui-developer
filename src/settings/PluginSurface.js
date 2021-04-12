import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

const PluginSurface = () => {
  const [pluginType, setPluginType] = useState('eusage-reports');

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.plugin-surface" />}
    >
      Plugin type:
      {' '}
      <input type="text" value={pluginType} onChange={(e) => setPluginType(e.target.value)} />
      <h3>{`${pluginType}`}</h3>
      <Pluggable type={pluginType} id="pluggable-surface" />
    </Pane>
  );
};

export default PluginSurface;
