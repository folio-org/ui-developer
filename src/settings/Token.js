import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { ConfigForm } from '@folio/stripes/smart-components';
import { Col, Row, TextField } from '@folio/stripes/components';


class Token extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
  }

  onSave(data) {
    const stripes = this.props.stripes;
    stripes.setToken(data.token);
  }

  render() {
    const stripes = this.props.stripes;
    const token = stripes.store.getState().okapi.token;

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
              />
            </Col>
          </Row>
        </ConfigForm>
      </div>
    );
  }
}

export default Token;
