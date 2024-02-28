import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  CHANNELS,
  EVENTS,
} from '@folio/stripes/core';

import {
  Button,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';

/**
 * emit session-related events
 * @returns
 */
const IdleSessionTimeout = () => {
  const dispatchIdleSession = () => {
    window.dispatchEvent(new Event(EVENTS.AUTHN.IDLE_SESSION_WARNING));
  };

  const broadcastRtrSuccss = () => {
    const bc = new BroadcastChannel(CHANNELS.AUTHN);
    bc.postMessage({
      type: EVENTS.AUTHN.RTR_SUCCESS,
      message: 'this is a message',
    });
  };

  return (
    <Pane
      defaultWidth="fill"
      renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.idleSession" />} />}
    >
      <ul>
        <li><Button onClick={dispatchIdleSession}><FormattedMessage id="ui-developer.idleSession.emitIdleSessionWarning" /></Button></li>
        <li><Button onClick={broadcastRtrSuccss}><FormattedMessage id="ui-developer.idleSession.emitRTRSuccess" /></Button></li>
      </ul>
    </Pane>
  );
};

IdleSessionTimeout.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default IdleSessionTimeout;
