import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

const PluginSurface = () => {
  const [pluginType, setPluginType] = useState('');

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.plugin-surface" />}
    >
      <FormattedMessage id="ui-developer.plugin-surface.type" />
      {' '}
      <input type="text" value={pluginType} onChange={(e) => setPluginType(e.target.value)} />
      <p>
        <FormattedMessage id="ui-developer.plugin-surface.forExample" values={{ pluginType: 'ui-agreements-extension' }} />
      </p>
      <hr />
      <Pluggable type={pluginType} id="pluggable-surface">
        <FormattedMessage id="ui-developer.plugin-surface.noPlugin" values={{ pluginType }} />
      </Pluggable>
    </Pane>
  );
};

export default PluginSurface;
