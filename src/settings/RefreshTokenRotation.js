import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Button, LoadingPane, Pane, PaneHeader, TextField } from '@folio/stripes/components';
import { getTokenExpiry, RTR_CONSTANTS } from '@folio/stripes/core';

/**
 * manipulate AT/RT expiration dates in storage in order to test RTR.
 */
const RefreshTokenRotation = ({ stripes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState({ atExpires: -1, rtExpires: -1 });

  useEffect(() => {
    const callback = () => {
      setIsLoading(true);
      getTokenExpiry().then((te) => {
        setTokenExpiration({
          atExpires: te.atExpires ?? te.accessTokenExpiration ?? -1,
          rtExpires: te.rtExpires ?? te.refreshTokenExpiration ?? -1,
        });
        setIsLoading(false);
      });
    };

    callback();

    window.addEventListener(RTR_CONSTANTS.RTR_SUCCESS_EVENT, callback);

    return () => window.removeEventListener(RTR_CONSTANTS.RTR_SUCCESS_EVENT, callback);
  }, []);

  /**
   * forceRefresh
   * dispatch an event to force a token rotation
   */
  const forceRefresh = useCallback(
    () => window.dispatchEvent(new Event(RTR_CONSTANTS.RTR_FORCE_REFRESH_EVENT)),
    [],
  );

  /**
   * saveRtrConfig
   * update stripes.config.rtr from form
   */
  const saveRtrConfig = useCallback(
    (values) => {
      merge(stripes.config.rtr, {
        idleSessionTTL: values.idleSessionTTL,
        idleModalTTL: values.idleModalTTL,
        fixedLengthSessionWarningTTL: values.fixedLengthSessionWarningTTL,
        rotationIntervalFraction: Number(values.rotationIntervalFraction),
        activityEvents: values.activityEvents.split(',').map((e) => e.trim()),
      });

      forceRefresh();
    },
    [stripes, forceRefresh],
  );

  if (!isLoading) {
    return (
      <Pane
        defaultWidth="fill"
        renderHeader={(renderProps) => (
          <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.rtr" />} />
        )}
      >
        <ul>
          <li>
            stripes logs RTR events in the category <code>rtr</code>
          </li>
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
          <Button onClick={forceRefresh}>
            <FormattedMessage id="ui-developer.rtr.forceRefresh" />
          </Button>

          <Form
            onSubmit={saveRtrConfig}
            initialValues={{
              ...stripes.config.rtr,
              activityEvents: stripes.config.rtr.activityEvents.join(','),
            }}
          >
            {({ handleSubmit, pristine, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  component={TextField}
                  name="idleSessionTTL"
                  label={<FormattedMessage id="ui-developer.rtr.idleSessionTTL" />}
                />
                <Field
                  component={TextField}
                  name="idleModalTTL"
                  label={<FormattedMessage id="ui-developer.rtr.idleModalTTL" />}
                />
                <Field
                  component={TextField}
                  name="fixedLengthSessionWarningTTL"
                  label={<FormattedMessage id="ui-developer.rtr.fixedLengthSessionWarningTTL" />}
                />
                <Field
                  component={TextField}
                  name="rotationIntervalFraction"
                  label={<FormattedMessage id="ui-developer.rtr.rotationIntervalFraction" />}
                  type="number"
                  step={0.01}
                  min={0}
                />
                <Field
                  component={TextField}
                  name="activityEvents"
                  label={<FormattedMessage id="ui-developer.rtr.activityEvents" />}
                />
                <Button buttonStyle="primary" type="submit" disabled={pristine || submitting}>
                  <FormattedMessage id="stripes-core.button.save" />
                </Button>
              </form>
            )}
          </Form>
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
    }),
    config: PropTypes.shape({
      rtr: PropTypes.shape({
        idleSessionTTL: PropTypes.string,
        idleModalTTL: PropTypes.string,
        rotationIntervalFraction: PropTypes.number,
        activityEvents: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  }).isRequired,
};

export default RefreshTokenRotation;
