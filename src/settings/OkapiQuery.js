import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Col,
  Pane,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';

/**
 * Send a query directly to Okapi, i.e. be Postman, or cURL, or however
 * you want to think of it. If the query does not have a limit clause,
 * append `limit=100`. We want to help people get useful results but
 * also prevent them from killing their server.
 */
class OkapiQuery extends React.Component {
  static manifest = Object.freeze({
    okapiResource: {
      type: 'okapi',
      accumulate: true,
      fetch: false,
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      okapiResource: PropTypes.object,
      moduleId: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      okapiResource: PropTypes.object,
    }),
  };


  constructor() {
    super();
    this.state = {
      buttonValue: 'ui-developer.okapiQuery.runQuery',
      limitWarning: '',
      query: '',
      results: {},
    };
  }

  limitWarning = () => (
    <Row>
      <Col xs={12}>
        <FormattedMessage id="ui-developer.okapiQuery.limitWarning" />
      </Col>
    </Row>
  );

  handleQuery = (event) => {
    event.stopPropagation();

    let max = 100;

    const { mutator } = this.props;

    this.setState({
      buttonValue: 'ui-developer.okapiQuery.running',
      limitWarning: '',
    });

    let path = this.state.query;

    // if there is a limit, cap it at 100 unless it was specified less.
    // if there is no limit, apply limit=100
    const l = path.match(/limit=([0-9]+)/);
    if (l) {
      if (l[1]) {
        const given = Number.parseInt(l[1], 10);
        if (given < max) {
          max = given;
        } else {
          this.setState({
            limitWarning: this.limitWarning(),
          });
        }
      }
      path = path.replace(/limit=[0-9]*/, `limit=${max}`);
    } else {
      path = `${path}${path.indexOf('?') === -1 ? '?' : ''}&limit=${max}`;
    }

    mutator.okapiResource.GET({ path }).then(results => {
      this.setState({
        results,
        buttonValue: 'ui-developer.okapiQuery.runQuery'
      });
    });
  }

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  }

  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.okapiQuery" />}
      >
        <Row>
          <Col xs={12}>
            <TextField label={<FormattedMessage id="ui-developer.okapiQuery.queryPath" />} name="query" fullWidth value={this.state.query} onChange={this.handleQueryChange} />
            <div><Button onClick={this.handleQuery}><FormattedMessage id={this.state.buttonValue} /></Button></div>
          </Col>
        </Row>
        {this.state.limitWarning}
        <Row>
          <Col xs={12}>
            <TextArea fullWidth style={{ height: '85%' }} value={JSON.stringify(this.state.results, null, 2)} />
          </Col>
        </Row>
      </Pane>
    );
  }
}

OkapiQuery.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(OkapiQuery);
