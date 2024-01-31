import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  getTokenExpiry,
  setTokenExpiry,
} from '@folio/stripes/core';

import {
  Button,
  LoadingPane,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';

/**
 * manipulate AT/RT expiration dates in storage in order to test RTR.
 * @returns
 */
const RefreshTokenRotation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState({});

  useEffect(() => {
    getTokenExpiry()
      .then(te => {
        setTokenExpiration(te ?? { atExpires: -1, rtExpires: -1 });
        setIsLoading(false);
      });
  }, []);

  /**
   * invalidateAT
   * return a promise to expire the AT in local storage
   */
  const invalidateAT = () => {
    return getTokenExpiry()
      .then(te => {
        const expiration = { ...te };
        expiration.atExpires = -1;

        return setTokenExpiry(expiration);
      });
  };

  /**
   * invalidateRT
   * return a promise to expire the AT and RT in local storage
   */
  const invalidateRT = () => {
    const expiration = {
      atExpires: -1,
      rtExpires: -1,
    };

    return setTokenExpiry(expiration);
  };

  if (!isLoading) {
    return (
      <Pane
        defaultWidth="fill"
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.rtr" />} />}
      >
        <ul>
          <li>stripes logs RTR events in the category <code>rtr</code></li>
        </ul>
        {!isLoading && (
          <dl>
            <dt>AT Expiry</dt>
            <dd>{new Date(tokenExpiration.atExpires).toISOString()}</dd>
            <dt>RT Expiry</dt>
            <dd>{new Date(tokenExpiration.rtExpires).toISOString()}</dd>
          </dl>
        )}
        <div>
          <Button onClick={invalidateAT}><FormattedMessage id="ui-developer.rtr.invalidateAT" /></Button>
          <Button onClick={invalidateRT}><FormattedMessage id="ui-developer.rtr.invalidateRT" /></Button>
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
