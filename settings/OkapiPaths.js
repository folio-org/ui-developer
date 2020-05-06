import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';


import {
  Pane,
} from '@folio/stripes/components';

/**
 * fetch the paths associated with the available interfaces to provide a way
 * to figure out which path is provided by which interface.
 */
class OkapiPaths extends React.Component {
  static manifest = Object.freeze({
    moduleDetails: {
      type: 'okapi',
      accumulate: true,
      fetch: false,
    },
    moduleId: '',
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      moduleDetails: PropTypes.object,
      moduleId: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      moduleDetails: PropTypes.object,
    }),
  };


  constructor() {
    super();
    this.state = {
      paths: {},
      filter: '',
    };
  }

  componentDidMount() {
    const { mutator } = this.props;

    const modules = get(this.props.stripes, ['discovery', 'modules']) || {};

    const paths = this.state.paths;
    Object.keys(modules).forEach(m => {
      mutator.moduleDetails.GET({ path: `_/proxy/modules/${m}` }).then(res => {
        if (res.provides) {
          res.provides.forEach(i => {
            i.handlers.forEach(handler => {
              paths[handler.pathPattern] = m;
            });
          });
        }
        this.setState({ paths });
      });
    });
  }

  showPaths = () => {
    return Object
      .keys(this.state.paths)
      .sort()
      .filter(path => path.indexOf(this.state.filter) >= 0)
      .map(path => <li key={path}>{path} = {this.state.paths[path]}</li>);
  }

  handleFilter = (event) => {
    this.setState({ filter: event.target.value });
  }

  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle="Okapi paths"
      >
        <div>
          <h3>resource path to interface mapper</h3>
          <input type="text" name="" onChange={this.handleFilter} />
        </div>
        <ul>
          {this.showPaths()}
        </ul>
      </Pane>
    );
  }
}

OkapiPaths.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(OkapiPaths);
