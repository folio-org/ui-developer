import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getTokenExpiry, useStripes } from '@folio/stripes/core';
import { LoadingPane, MessageBanner, Pane, PaneHeader } from '@folio/stripes/components';

/**
 * display AT/RT expiration data, and IST and RTR config values
 */
const RefreshTokenRotation = () => {
  const { config: { rtr } } = useStripes();
  const [isLoading, setIsLoading] = useState(true);
  const [expiry, setExpiry] = useState({});

  useEffect(() => {
    setIsLoading(true);
    getTokenExpiry().then((te) => {
      setExpiry(te ?? { atExpires: -1, rtExpires: -1 });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingPane />;
  }

  return (
    <Pane
      defaultWidth="fill"
      renderHeader={(renderProps) => (
        <PaneHeader {...renderProps} paneTitle={<FormattedMessage id="ui-developer.rtr" />} />
      )}
    >
      <MessageBanner>
        <FormattedMessage id="ui-developer.rtr.logCategories" />
      </MessageBanner>
      <dl>
        <dt><FormattedMessage id="ui-developer.rtr.atExpiration" /></dt>
        <dd>{new Date(expiry.atExpires).toISOString()}</dd>

        <dt><FormattedMessage id="ui-developer.rtr.rtExpiration" /></dt>
        <dd>{new Date(expiry.rtExpires).toISOString()}</dd>

        <dt><FormattedMessage id="ui-developer.rtr.idleSessionTTL" /></dt>
        <dd>{rtr.idleSessionTTL}</dd>

        <dt><FormattedMessage id="ui-developer.rtr.idleModalTTL" /></dt>
        <dd>{rtr.idleModalTTL}</dd>

        <dt><FormattedMessage id="ui-developer.rtr.fixedLengthSessionWarningTTL" /></dt>
        <dd>{rtr.fixedLengthSessionWarningTTL}</dd>

        <dt><FormattedMessage id="ui-developer.rtr.activityEvents" /></dt>
        {rtr.activityEvents.toSorted((a, b) => a.localeCompare(b)).map(i => <dd key={i}>{i}</dd>)}
      </dl>
    </Pane>
  );
};

export default RefreshTokenRotation;
