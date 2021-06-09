import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Pane, Row, Col } from '@folio/stripes/components';

const PluginSurface = () => {
  const [pluginType, setPluginType] = useState('');
  const [pluginData, setPluginData] = useState('');

  let dataObject;
  let dataOK = false;
  try {
    dataObject = JSON.parse(pluginData);
    dataOK = true;
  } catch (e) {
    // Nothing to do
  }

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.plugin-surface" />}
    >
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-developer.plugin-surface.type" />
        </Col>
        <Col xs={8}>
          <input type="text" value={pluginType} onChange={(e) => setPluginType(e.target.value)} />
        </Col>
      </Row>
      <Row>
        <Col xs={4} />
        <Col xs={8}>
          <p>
            <FormattedMessage
              id="ui-developer.plugin-surface.exampleType"
              values={{
                pluginType: 'ui-agreements-extension',
                code: chunks => <code>{chunks}</code>,
              }}
            />
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-developer.plugin-surface.data" />
        </Col>
        <Col xs={8}>
          <textarea
            value={pluginData}
            style={{ backgroundColor: (dataOK || pluginData === '') ? 'white' : '#fcc' }}
            onChange={(e) => setPluginData(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4} />
        <Col xs={8}>
          <p>
            <FormattedMessage
              id="ui-developer.plugin-surface.exampleData"
              values={{
                data: '{"op":"match-names"}',
                code: chunks => <code>{chunks}</code>,
              }}
            />
          </p>
        </Col>
      </Row>

      <hr style={{ marginTop: '2em' }} />
      <Pluggable type={pluginType} id="pluggable-surface" data={dataObject}>
        <FormattedMessage id="ui-developer.plugin-surface.noPlugin" values={{ pluginType }} />
      </Pluggable>
    </Pane>
  );
};

export default PluginSurface;
