import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { getTokenExpiry } from '@folio/stripes/core';
import { Button, LoadingPane, Pane, PaneHeader, TextField } from '@folio/stripes/components';

/**
 * manipulate AT/RT expiration dates in storage in order to test RTR.
 * @returns
 */
const RefreshTokenRotation = ({ stripes }) => {
  // why WHY copy this string here instead of importing it from stripes-core?
  //
  // RTR_FORCE_REFRESH_EVENT will be present in stripes-core 10.2.0 (stripes
  // 9.2.0). Importing it would force the stripes peer depedency to bump from
  // ^9.1.0 to ^9.2.0.If we copy the string instead of importing it, we can
  // remain compatible with 9.1.0.
  //
  // OK, compatibility is nice. But it's still gross, right? Yep, super gross.
  // Aren't you nauseated? Yes, yes I am. 🤢🧼🛁
  const RTR_FORCE_REFRESH_EVENT = '@folio/stripes/core::RTRForceRefresh';

  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState({});

  useEffect(() => {
    setIsLoading(true);
    getTokenExpiry().then((te) => {
      setTokenExpiration(te ?? { atExpires: -1, rtExpires: -1 });
      setIsLoading(false);
    });
  }, []);

  /**
   * forceRefresh
   * dispatch an event to force a token rotation
   */
  const forceRefresh = useCallback(
    () => window.dispatchEvent(new Event(RTR_FORCE_REFRESH_EVENT)),
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
