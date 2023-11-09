import { merge } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import {
  Checkbox,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';
import { ConfigFinalForm } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';

class Configuration extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
  }

  onSave(data) {
    const stripes = this.props.stripes;
    merge(stripes, data);

    // dispatch locale to force the stripes-intl context to re-render,
    // allowing the suppressIntlErrors setting to take effect
    stripes.setLocale(stripes.locale);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then(reg => {
          const sw = reg.installing || reg.waiting || reg.active;
          if (sw) {
            stripes.logger.log('rtr', 'sending LOGGER_CONFIG');
            sw.postMessage({ source: '@folio/stripes-core', type: 'LOGGER_CONFIG', value: { categories: data.logger.categories } });
          } else {
            // eslint-disable-next-line no-console
            console.error('error sending LOGGER; sw not registered');
          }
        });
    } else {
      // eslint-disable-next-line no-console
      console.error('error sending LOGGER; serviceWorker not found in navigator');
    }

    this.forceUpdate();
  }

  render() {
    const stripes = this.props.stripes;
    if (!stripes.config.autoLogin) { stripes.config.autoLogin = { username: '', password: '' }; }

    const initialValues = {
      logger: {
        categories: stripes.logger.categories,
      },
      config: {
        showPerms: stripes.config.showPerms || false,
        listInvisiblePerms: stripes.config.listInvisiblePerms || false,
        hasAllPerms: stripes.config.hasAllPerms || false,
        showHomeLink: stripes.config.showHomeLink || false,
        showDevInfo: stripes.config.showDevInfo || false,
        suppressIntlErrors: stripes.config.suppressIntlErrors || false,
        autoLogin: {
          username: stripes.config.autoLogin.username,
          password: stripes.config.autoLogin.password,
        },
        preserveConsole: stripes.config.preserveConsole || false,
      },
    };

    return (
      <div style={{ width: '100%' }}>
        <ConfigFinalForm
          onSubmit={this.onSave}
          label={this.props.label}
          initialValues={initialValues}
        >
          <Row>
            <Col xs={12}>
              <Field
                htmlFor="1"
                component={TextField}
                name="logger.categories"
                label={<FormattedMessage id="ui-developer.configuration.loggingCategories" />}
              />
              (
              <FormattedMessage
                id="ui-developer.configuration.loggingDocumentationLink"
                values={{
                  a: chunks => (
                    <a href="https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#configuring-the-logger">
                      {chunks}
                    </a>
                  ),
                }}
              />
              )
              <hr />
              <Field
                htmlFor="2"
                component={TextField}
                name="config.autoLogin.username"
                label={<FormattedMessage id="ui-developer.configuration.autoLoginUsername" />}
              />
              <Field
                htmlFor="3"
                component={TextField}
                name="config.autoLogin.password"
                label={<FormattedMessage id="ui-developer.configuration.autoLoginPassword" />}
              />
              <hr />
              <Field
                htmlFor="4"
                component={Checkbox}
                type="checkbox"
                name="config.showPerms"
                id="config.showPerms"
                label={<FormattedMessage id="ui-developer.configuration.showPermissionsInMenu" />}
              />
              <Field
                htmlFor="5"
                component={Checkbox}
                type="checkbox"
                name="config.listInvisiblePerms"
                id="config.listInvisiblePerms"
                label={<FormattedMessage id="ui-developer.configuration.listInvisiblePermissions" />}
              />
              <Field
                htmlFor="6"
                component={Checkbox}
                type="checkbox"
                name="config.hasAllPerms"
                id="config.hasAllPerms"
                label={<FormattedMessage id="ui-developer.configuration.actAsRoot" />}
              />
              <Field
                htmlFor="7"
                component={Checkbox}
                type="checkbox"
                name="config.showHomeLink"
                id="config.showHomeLink"
                label={<FormattedMessage id="ui-developer.configuration.showHomeLink" />}
              />
              <Field
                htmlFor="8"
                component={Checkbox}
                type="checkbox"
                name="config.showDevInfo"
                id="config.showDevInfo"
                label={<FormattedMessage id="ui-developer.configuration.showDevInfo" />}
              />
              <Field
                htmlFor="9"
                component={Checkbox}
                type="checkbox"
                name="config.suppressIntlErrors"
                id="config.suppressIntlErrors"
                label={<FormattedMessage id="ui-developer.configuration.suppressIntlErrors" />}
              />
              <Field
                htmlFor="10"
                component={Checkbox}
                type="checkbox"
                name="config.preserveConsole"
                id="config.preserveConsole"
                label={<FormattedMessage id="ui-developer.configuration.preserveConsole" />}
              />
            </Col>
          </Row>
        </ConfigFinalForm>
      </div>
    );
  }
}

export default Configuration;

