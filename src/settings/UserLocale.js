import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, createIntl, createIntlCache, injectIntl } from 'react-intl';
import { Field, Form } from 'react-final-form';

import {
  CalloutContext,
  stripesConnect,
  supportedLocales,
  supportedNumberingSystems,
  userLocaleConfig,
} from '@folio/stripes/core';
import { Button, Pane, Select, TextField, CurrencySelect } from '@folio/stripes/components';
import timezones from '../util/timezones';

const timeZonesOptions = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

/**
 * localesList: list of available locales suitable for a Select
 * label contains language in context's locale and in iteree's locale
 * e.g. given the context's locale is `en` and the keys `ar` and `zh-CN` show:
 *     Arabic / العربية
 *     Chinese (China) / 中文（中国）
 * e.g. given the context's locale is `ar` and the keys `ar` and `zh-CN` show:
 *     العربية / العربية
 *     الصينية (الصين) / 中文（中国）
 *
 * @param {object} intl react-intl object in the current context's locale
 * @returns {array} array of {value, label} suitable for a Select
 */
const localesList = (intl) => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  // error handler if an intl context cannot be created,
  // i.e. if the browser is missing support for the requested locale
  const logLocaleError = (e) => {
    console.warn(e); // eslint-disable-line
  };

  // iterate through the locales list to build an array of { value, label } objects
  const locales = supportedLocales.map(l => {
    // intl instance with locale of current iteree
    const lIntl = createIntl({
      locale: l,
      messages: {},
      onError: logLocaleError,
    },
    cache);

    return {
      value: l,
      label: `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`,
    };
  });

  return locales;
};

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

class UserLocale extends React.Component {
  static manifest = Object.freeze({
    configId: '',
    userExists: {
      type: 'okapi',
      path: 'users',
      fetch: false,
      accumulate: true
    },
    localeConfig: {
      type: 'okapi',
      path: 'configurations/entries',
      fetch: false,
      accumulate: true,
    },
  });

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.localesOptions = localesList(props.intl);
    this.numberingSystemOptions = [
      { value: '', label: '---' },
      ...numberingSystemsList()
    ];
    this.callout = React.createRef();
  }

  submit = (values, form) => {
    const { mutator, intl } = this.props;
    const configEntry = { ...userLocaleConfig };

    const { currency, numberingSystem, timezone } = values;
    let { locale } = values;

    // GET the user by username in order to get their UUID.
    // .then(add id to locale-settings)
    // .then(check whether there is already a config entry)
    // .then(if yes, PUT locale; if no, POST locale)
    // .then(send success callout)
    // .catch(send failure callout)
    mutator.userExists.GET({ params: { query: `username==${values.username}` } })
      .then((res) => {
        configEntry.userId = res.users[0]?.id;
        if (!configEntry.userId) {
          throw new Error(intl.formatMessage({ id: 'ui-developer.passwd.error.missingUser' }, { username: values.username }));
        }
      })
      .then(() => {
        const query = Object.entries(configEntry)
          .map(([k, v]) => `"${k}"=="${v}"`)
          .join(' AND ');

        return mutator.localeConfig.GET({ params: { query } });
      })
      .then((res) => {
        // A numbering system other than the locale's default
        // may be configured with `-u-nu-SYSTEM`
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem
        if (numberingSystem) {
          locale = `${locale}-u-nu-${numberingSystem}`;
        }

        configEntry.value = JSON.stringify({ locale, timezone, currency });

        if (res.configs.length) {
          configEntry.id = res.configs[0].id;
          return mutator.localeConfig.PUT(configEntry, { pk: 'id' });
        } else {
          return mutator.localeConfig.POST(configEntry);
        }
      })
      .then(() => {
        this.context.sendCallout({
          type: 'success',
          message: (<FormattedMessage id="ui-developer.userLocale.success" values={{ username: values.username }} />)
        });
        form.restart();
      })
      .catch(e => {
        this.context.sendCallout({
          type: 'error',
          message: e.message,
        });
      });
  };

  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.userLocale.setUserLocale" />}
      >
        <Form
          onSubmit={this.submit}
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
                id="locale"
                name="locale"
                placeholder="---"
                dataOptions={this.localesOptions}
                label={<FormattedMessage id="ui-developer.userLocale.locale" />}
              />
              <Field
                component={Select}
                id="numberingSystem"
                name="numberingSystem"
                dataOptions={this.numberingSystemOptions}
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
  }
}

UserLocale.propTypes = {
  intl: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    configId: PropTypes.object,
    passwd: PropTypes.object,
    userExists: PropTypes.object,
    localeConfig: PropTypes.object,
  }).isRequired,
};
export default injectIntl(stripesConnect(UserLocale));
