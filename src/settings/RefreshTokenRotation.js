import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import localforage from 'localforage';

import {
  registerServiceWorker,
  unregisterServiceWorker,
  useStripes,
} from '@folio/stripes/core';

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
          console.warn('could not dispatch message; no active registration'); // eslint-disable-line no-console
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

  /**
   * registerSW
   * Call the service-worker registration function.
   */
  const registerSW = () => {
    registerServiceWorker(stripes.okapi, stripes.logger.categories, stripes.logger);
  };

  /**
   * unregisterSW
   * Call the service-worker remove-registration function. This has the same effect
   * as using the browser's developer-tools to disable an active service worker.
   */
  const unregisterSW = () => {
    unregisterServiceWorker();
  };

  if (!isLoading) {
    return (
      <Pane
        defaultWidth="fill"
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.rtr" />} />}
      >
        <ul>
          <li>service-worker logs RTR events in the category <code>rtr-sw</code></li>
          <li>stripes logs RTR events in the category <code>rtr</code></li>
        </ul>
        <div>
          <Button onClick={invalidateAT}><FormattedMessage id="ui-developer.rtr.invalidateAT" /></Button>
          <Button onClick={invalidateRT}><FormattedMessage id="ui-developer.rtr.invalidateRT" /></Button>
        </div>
        <div>
          <Button onClick={registerSW}><FormattedMessage id="ui-developer.rtr.registerServiceWorker" /></Button>
          <Button onClick={unregisterSW}><FormattedMessage id="ui-developer.rtr.unregisterServiceWorker" /></Button>
        </div>
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
