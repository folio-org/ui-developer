import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { ConfigForm } from '@folio/stripes/smart-components';
import { Col, Row, TextField } from '@folio/stripes/components';

/**
 * Display decoded JWT token. Set a new token.
 */
class Token extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      raw: props.stripes.store.getState().okapi.token,
      cooked: {},
      error: '',
    };
  }

  /**
   * decode the original token
   */
  componentDidMount = () => {
    this.setState((state) => ({
      cooked: this.parseToken(state.raw),
    }));
  }

  onSave = (data) => {
    const stripes = this.props.stripes;
    stripes.setToken(data.token);
  }

  /**
   * decode a JWT token and save it in state.cooked. if decoding fails,
   * write an error to state.error.
   *
   * verbatim from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
   */
  parseToken = (t) => {
    let parsed = {};
    if (t) {
      try {
        const base64Url = t.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        parsed = JSON.parse(jsonPayload);
        this.setState({ error: '', cooked: parsed });
      } catch (e) {
        this.setState({ error: 'Malformed token', cooked: '' });
      }
    }
  }

  /**
   * parse the new value.
   */
  handleTokenChange = (event, newValue) => {
    this.parseToken(newValue);
  }

  render() {
    const token = this.state.raw;

    return (
      <div style={{ width: '100%' }}>
        <ConfigForm onSubmit={this.onSave} label={this.props.label} initialValues={{ token }}>
          <Row>
            <Col xs={12}>
              <Field
                component={TextField}
                id="token"
                name="token"
                label={<FormattedMessage id="ui-developer.setToken.authenticationToken" />}
                onChange={this.handleTokenChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <dl>
                {this.state.cooked && Object.entries(this.state.cooked).map(([k, v]) => (
                  <>
                    <dt key={k}>{k}</dt>
                    <dd>{v}</dd>
                  </>
                ))}
              </dl>
              {this.state.error && <div>{this.state.error}</div>}
            </Col>
          </Row>
        </ConfigForm>
      </div>
    );
  }
}

export default Token;
