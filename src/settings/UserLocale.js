import React, { useMemo } from 'react';
import {
  FormattedMessage,
  createIntl,
  createIntlCache,
  useIntl,
} from 'react-intl';
import { Field, Form } from 'react-final-form';

import {
  useCallout,
  supportedNumberingSystems,
  userOwnLocaleConfig,
  usePreferences,
  useStripes,
} from '@folio/stripes/core';
import { Button, CurrencySelect, Pane, Select, TextField, timezones } from '@folio/stripes/components';

import { useUsers } from '../queries';

const timeZonesOptions = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

/**
 * numberingSystemsList: list of available systems, suitable for a Select
 * label contains the name and the digits zero-nine in the given system
 * e.g. given the system is `latn` show:
 *     latn (0 1 2 3 4 5 6 7 8 9)
 * e.g. given the system is `arab` show:
 *     arab (٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩)
 * More info on numbering systems:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem

 * @returns {array} array of {value, label} suitable for a Select
 */
const numberingSystemsList = () => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  const formats = supportedNumberingSystems.map(f => {
    const lIntl = createIntl({
      locale: `en-u-nu-${f}`,
      messages: {},
    },
    cache);

    return {
      value: f,
      label: `${f} (${Array.from(Array(10).keys()).map(i => lIntl.formatNumber(i)).join(' ')})`,
    };
  });

  return formats;
};

const UserLocale = () => {
  const intl = useIntl();
  const callout = useCallout();
  const stripes = useStripes();

  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const {
    setPreference,
    getPreference,
  } = usePreferences();

  const { fetchUsers } = useUsers({ tenantId: centralTenantId });

  const numberingSystemOptions = useMemo(() => [
    { value: '', label: '---' },
    ...numberingSystemsList()
  ], []);

  const fetchUserLocale = (userId) => {
    return getPreference({
      scope: userOwnLocaleConfig.SCOPE,
      key: userOwnLocaleConfig.KEY,
      userId,
    });
  };

  const mutateUserLocale = (value, userId) => {
    return setPreference({
      scope: userOwnLocaleConfig.SCOPE,
      key: userOwnLocaleConfig.KEY,
      value,
      userId,
    });
  };

  const submit = (values, form) => {
    const { currency, numberingSystem, timezone } = values;
    let userId;

    // GET the user by username in order to get their UUID.
    // .then(add id to locale-settings)
    // .then(check whether there is already a config entry)
    // .then(if yes, PUT locale; if no, POST locale)
    // .then(send success callout)
    // .catch(send failure callout)
    fetchUsers({ query: `username=="${values.username}"` })
      .then((res) => {
        userId = res.users[0]?.id;

        if (!userId) {
          throw new Error(intl.formatMessage({ id: 'ui-developer.passwd.error.missingUser' }, { username: values.username }));
        }
      })
      .then(() => {
        return fetchUserLocale(userId);
      })
      .then((res) => {
        const value = {
          locale: res?.locale,
          numberingSystem,
          timezone,
          currency,
        };

        return mutateUserLocale(value, userId);
      })
      .then(() => {
        callout.sendCallout({
          type: 'success',
          message: (<FormattedMessage id="ui-developer.userLocale.success" values={{ username: values.username }} />)
        });
        form.restart();
      })
      .catch(e => {
        callout.sendCallout({
          type: 'error',
          message: e.message,
        });
      });
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.userLocale.setUserLocale" />}
    >
      <Form
        onSubmit={submit}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Field
              component={TextField}
              id="username"
              name="username"
              label={<FormattedMessage id="ui-developer.userLocale.username" />}
            />
            <Field
              component={Select}
              id="numberingSystem"
              name="numberingSystem"
              dataOptions={numberingSystemOptions}
              label={<FormattedMessage
                id="ui-developer.userLocale.numberingSystem"
                values={{
                  a: chunks => <a target="new" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem">{chunks}</a>
                }}
              />}
            />
            <Field
              component={Select}
              id="timezone"
              name="timezone"
              placeholder="---"
              dataOptions={timeZonesOptions}
              label={<FormattedMessage id="ui-developer.userLocale.timeZone" />}
            />
            <Field
              component={CurrencySelect}
              id="currency"
              name="currency"
              placeholder="---"
              label={<FormattedMessage id="ui-developer.userLocale.currency" />}
            />
            <Button
              id="clickable-save-instance"
              buttonStyle="primary mega"
              type="submit"
              disabled={(pristine || submitting)}
            >
              <FormattedMessage id="stripes-core.button.save" />
            </Button>
          </form>
        )}
      />
    </Pane>
  );
};

export default UserLocale;
