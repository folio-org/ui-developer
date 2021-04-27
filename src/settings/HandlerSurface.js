import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HandlerManager } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

const HandlerSurface = ({ stripes }) => {
  const [handlerEvent, setHandlerEvent] = useState('ui-agreements-extension');

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.handler-surface" />}
    >
      <FormattedMessage id="ui-developer.handler-surface.event" />
      {' '}
      <input type="text" value={handlerEvent} onChange={(e) => setHandlerEvent(e.target.value)} />
      <p>
        <FormattedMessage id="ui-developer.handler-surface.forExample" values={{ handlerEvent: 'ui-agreements-extension' }} />
      </p>
      <hr />
      <HandlerManager event={handlerEvent} id="handler-surface" stripes={stripes} />
    </Pane>
  );
};

HandlerSurface.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default HandlerSurface;
