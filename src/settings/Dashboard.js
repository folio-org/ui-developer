
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
} from '@folio/stripes/components';
import DashboardWidget from './DashboardWidget';


/**
 * Send a query directly to Okapi, i.e. be Postman, or cURL, or however
 * you want to think of it. If the query does not have a limit clause,
 * append `limit=100`. We want to help people get useful results but
 * also prevent them from killing their server.
 */
class Dashboard extends React.Component {
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
      widgets: {},
      q: '',
      example: [{ 'id': '1', 'path': 'users?query=personal.lastName<>Admin sortby updatedDate/sort.descending&limit=10', 'records': 'users', 'fields': 'id username barcode' }, { 'id': '2', 'path': 'groups', 'records': 'usergroups', 'fields': 'id group' },  { 'id': '3', 'path': 'addresstypes', 'records': 'addressTypes', 'fields': 'id addressType' }],
    };
  }

  limitWarning = () => (
    <Row>
      <Col xs={12}>
        <FormattedMessage id="ui-developer.okapiQuery.limitWarning" />
      </Col>
    </Row>
  );

  // if there is a limit, cap it at 10 unless it was specified less.
  // if there is no limit, apply limit=10
  limitFor = (path) => {
    let max = 10;
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
      return path.replace(/limit=[0-9]*/, `limit=${max}`);
    }

    return `${path}${path.indexOf('?') === -1 ? '?' : ''}&limit=${max}`;
  }

  handleQuery = (event) => {
    event.stopPropagation();

    const { mutator } = this.props;

    this.setState({
      buttonValue: 'ui-developer.okapiQuery.running',
      limitWarning: '',
    });

    let json = null;
    try {
      json = JSON.parse(this.state.q);
    } catch (e) {
      alert(e);
    }

    if (json) {
      json.forEach(i => {
        const path = this.limitFor(i.path);
        mutator.okapiResource.GET({ path }).then(results => {
          const fields = i.fields.split(/\s+/);
          const list = results[i.records].map((record) => (
            // filter results to only include requested fields
            Object.fromEntries(Object.entries(record).filter(([k, _v]) => fields.includes(k)))
          ));
          this.setState(pState => {
            const widgets = { ...pState.widgets };
            widgets[i.id] = list;
            return { widgets };
          });
        });
      });
    }
  }

  handleQueryChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  formatResults = () => {
    const list = [];
    for (const [k, v] of Object.entries(this.state.widgets)) {
      const l = [...v];
      list.push(<DashboardWidget results={l} key={k} />);
    }

    return list.length ? list : null;
  };

  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.okapiQuery" />}
      >
        <Row>
          <Col xs={12}>
            <TextArea label="query" name="q" fullWidth value={this.state.q} onChange={this.handleQueryChange} rows="5" cols="30" />
            <div><Button onClick={this.handleQuery}><FormattedMessage id={this.state.buttonValue} /></Button></div>
          </Col>
        </Row>
        <Row>
          <h3>sample queries</h3>
        </Row>
        <Row>
          <pre>{JSON.stringify(this.state.example, null, 2)}</pre>
        </Row>
        {this.state.limitWarning}
        <Row>
          <Col xs={12}>
            { this.formatResults()}
          </Col>
        </Row>
      </Pane>
    );
  }
}

Dashboard.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(Dashboard);
