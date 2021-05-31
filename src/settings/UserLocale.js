import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, createIntl, createIntlCache, injectIntl } from 'react-intl';
import { Field, Form } from 'react-final-form';

import {
  CalloutContext,
  stripesConnect,
  supportedLocales,
  userLocaleConfig,
} from '@folio/stripes/core';
import { Button, Col, Pane, Row, Select, TextField, CurrencySelect } from '@folio/stripes/components';
import timezones from '../util/timezones';

const timeZonesOptions = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const localesList = (intl) => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  // iterate through the locales list to build an array of { value, label } objects
  const locales = supportedLocales.map(l => {
    // intl instance with locale of current iteree
    const lIntl = createIntl({ locale: l, messages: {} }, cache);

    return {
      value: l,
      // label contains language in context's locale and in iteree's locale
      // e.g. given the context's locale is `en` and the keys `ar` and `zh-CN` show:
      //     Arabic / العربية
      //     Chinese (China) / 中文（中国）
      // e.g. given the context's locale is `ar` and the keys `ar` and `zh-CN` show:
      //    العربية / العربية
      //    الصينية (الصين) / 中文（中国）
      label: `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`,
    };
  });

  return locales;
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
      PUT: {
        path: 'configurations/entries/%{configId}',
      }
    },
  });

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.localesOptions = localesList(props.intl);
    this.callout = React.createRef();
  }

  submit = (values, form) => {
    const { mutator, intl } = this.props;
    const configEntry = { ...userLocaleConfig };

    const { locale, timezone, currency } = values;

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
        configEntry.value = JSON.stringify({ locale, timezone, currency });

        if (res.configs.length) {
          mutator.configId.replace(res.configs[0].id);
          return mutator.localeConfig.PUT(configEntry);
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
              <Row>
                <Col xs={12} id="select-user">
                  <Field
                    component={TextField}
                    id="username"
                    name="username"
                    label={<FormattedMessage id="ui-developer.userLocale.username" />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} id="select-locale">
                  <Field
                    component={Select}
                    id="locale"
                    name="locale"
                    placeholder="---"
                    dataOptions={this.localesOptions}
                    label={<FormattedMessage id="ui-developer.userLocale.locale" />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} id="select-timezone">
                  <Field
                    component={Select}
                    id="timezone"
                    name="timezone"
                    placeholder="---"
                    dataOptions={timeZonesOptions}
                    label={<FormattedMessage id="ui-developer.userLocale.timeZone" />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} id="select-currency">
                  <Field
                    component={CurrencySelect}
                    id="currency"
                    name="currency"
                    placeholder="---"
                    label={<FormattedMessage id="ui-developer.userLocale.currency" />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} id="select-currency">
                  <Button
                    id="clickable-save-instance"
                    buttonStyle="primary mega"
                    type="submit"
                    disabled={(pristine || submitting)}
                  >
                    <FormattedMessage id="stripes-core.button.save" />
                  </Button>
                </Col>
              </Row>
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
