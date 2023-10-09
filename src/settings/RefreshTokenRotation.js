import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import localforage from 'localforage';

import { useStripes } from '@folio/stripes/core';

import {
  Button,
  LoadingPane,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';

/**
 * manipulate AT/RT expiration dates in storage in order to test the RTR service worker.
 * @returns
 */
const RefreshTokenRotation = () => {
  let tokenExpiration = {};

  const [isLoading, setIsLoading] = useState(true);
  const stripes = useStripes();

  localforage.getItem('okapiSess')
    .then((data) => {
      console.log(data);
      tokenExpiration = {
        atExpires: data.tokenExpiration?.accessTokenExpiration ? new Date(data.tokenExpiration.accessTokenExpiration).getTime() : -1,
        rtExpires: data.tokenExpiration?.refreshTokenExpiration ? new Date(data.tokenExpiration.refreshTokenExpiration).getTime() : Date.now() + (10 * 60 * 1000),
      };
      setIsLoading(false);
    });

  const dispatchTokenExpiration = () => {
    stripes.logger.log('rtr', `atExpires ${tokenExpiration.atExpires}`);
    stripes.logger.log('rtr', `rtExpires ${tokenExpiration.rtExpires}`);

    navigator.serviceWorker.ready
      .then((reg) => {
        const sw = reg.active;
        if (sw) {
          const message = { source: '@folio/stripes-core', type: 'TOKEN_EXPIRATION', tokenExpiration };
          stripes.logger.log('rtr', '@folio/developer sending', message);
          sw.postMessage(message);
        } else {
          console.warn('could not dispatch message; no active registration');
        }
      });
  };

  /**
   * invalidateAT
   * expire the AT and notify the SW
   */
  const invalidateAT = () => {
    tokenExpiration.atExpires = -1;
    dispatchTokenExpiration();
  };

  /**
   * invalidateRT
   * expire the AT and the RT and notify the SW
   */
  const invalidateRT = () => {
    tokenExpiration.atExpires = -1;
    tokenExpiration.rtExpires = -1;

    dispatchTokenExpiration();
  };

  console.log('tokenexpieration', tokenExpiration);

  if (!isLoading) {
    return (
      <Pane
        defaultWidth="fill"
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.rtr" />} />}
      >
        <Button onClick={invalidateAT}><FormattedMessage id="ui-developer.rtr.invalidateAT" /></Button>
        <Button onClick={invalidateRT}><FormattedMessage id="ui-developer.rtr.invalidateRT" /></Button>
        <pre>{JSON.stringify(tokenExpiration, null, 2)}</pre>
      </Pane>
    );
  } else {
    return <LoadingPane />;
  }
};

RefreshTokenRotation.propTypes = {
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
    })
  }).isRequired,
};

export default RefreshTokenRotation;
