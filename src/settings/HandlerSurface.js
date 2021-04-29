import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HandlerManager } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

// We need to pass a `key` prop to <HandlerManager> to force a remount
// whenever the handlerEvent changes; otherwise we just re-render the
// existing <HandlerManager>, which has already cached the set of
// relevant handlers in its constructor.

const HandlerSurface = ({ stripes }) => {
  const [handlerEvent, setHandlerEvent] = useState('');

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
      <HandlerManager key={handlerEvent} event={handlerEvent} id="handler-surface" stripes={stripes} />
    </Pane>
  );
};

HandlerSurface.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default HandlerSurface;
