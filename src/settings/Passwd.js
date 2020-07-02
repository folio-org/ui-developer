import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Field } from 'react-final-form';

import { stripesConnect, CalloutContext } from '@folio/stripes/core';

import {
  Button,
  Headline,
  Pane,
  TextField
} from '@folio/stripes/components';

/**
 * Reset a user's password
 */
class Passwd extends React.Component {
  static manifest = Object.freeze({
    passwd: {
      type: 'okapi',
      path: 'authn/credentials',
      fetch: false,
    },
    userExists: {
      type: 'okapi',
      path: 'users',
      fetch: false,
      accumulate: true
    },
    isLocalPasswordSet: {
      type: 'okapi',
      path: 'authn/credentials-existence',
      fetch: false,
      accumulate: true,
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      passwd: PropTypes.object,
      isLocalPasswordSet: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      passwd: PropTypes.object,
    }),
  };

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.callout = React.createRef();
  }

  validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }
    if (!values.password) {
      errors.password = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }
    if (!values.confirm) {
      errors.confirm = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    } else if (values.confirm !== values.password) {
      errors.confirm = <FormattedMessage id="ui-developer.passwd.error.confirm" />;
    }
    return errors;
  };

  handleSubmit = (values, form) => {
    const { mutator, stripes, intl } = this.props;
    let userId;

    // GET the user by username in order to get their UUID.
    // .then(check whether that UUID already has credentials assigned)
    // .then(if yes, delete them then POST the new creds; if no, POST the new creds)
    // .then(
    //    callout about it, callout everything you feel
    //    give that UI notice that this password is for real
    // ).catch(
    //    callout about it, callout even if you bomb
    //    give that UI warning that something has gone so wrong
    // )
    mutator.userExists.GET({ params: { query: `username==${values.username}` } })
      .then((res) => {
        userId = res.users[0]?.id;
        if (!userId) {
          throw new Error(intl.formatMessage({ id: 'ui-developer.passwd.error.missingUser' }, { username: values.username }));
        }
      })
      .then(() => mutator.isLocalPasswordSet.GET({ params: { userId } }))
      .then(res => {
        const credentials = {
          username: values.username,
          password: values.password,
          userId,
        };

        if (!res.credentialsExist) {
          return mutator.passwd.POST(credentials);
        } else {
          // raw fetch because stripes-connect DELETE mutators can't handle
          // a request like /foo/bar?id=someValue
          // it expects only /foo/bar/someValue
          const options = {
            method: 'DELETE',
            headers: {
              'X-Okapi-Tenant': stripes.okapi.tenant,
              'X-Okapi-Token': stripes.store.getState().okapi.token,
              'Content-Type': 'application/json',
            },
          };
          return fetch(`${stripes.okapi.url}/authn/credentials?userId=${userId}`, options)
            .then(() => {
              mutator.passwd.POST(credentials);
            });
        }
      })
      .then(() => {
        this.context.sendCallout({
          type: 'success',
          message: (<FormattedMessage id="ui-developer.passwd.success" values={{ username: values.username }} />)
        });
        form.restart();
      })
      .catch(e => {
        this.context.sendCallout({
          type: 'error',
          message: e.message,
        });
      });
  }

  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.passwd.setUserPassword" />}
      >
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validate}
          render={({ handleSubmit, reset, submitting, pristine }) => (
            <form onSubmit={(e) => handleSubmit(e, reset)}>
              <Headline size="large" tag="h3">
                <FormattedMessage id="ui-developer.passwd.setUserPassword" />
              </Headline>
              <Field
                label={<FormattedMessage id="ui-developer.passwd.username" />}
                name="username"
                id="username"
                component={TextField}
              />
              <Field
                label={<FormattedMessage id="ui-developer.passwd.password" />}
                name="password"
                id="password"
                component={TextField}
                type="password"
              />
              <Field
                label={<FormattedMessage id="ui-developer.passwd.confirmPassword" />}
                name="confirm"
                id="confirm"
                component={TextField}
                type="password"
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

Passwd.propTypes = {
  intl: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    isLocalPasswordSet: PropTypes.object,
    passwd: PropTypes.object,
    userExists: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(stripesConnect(Passwd));
