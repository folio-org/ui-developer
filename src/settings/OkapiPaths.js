import React from 'react';
import PropTypes from 'prop-types';

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

  /**
   * read the list of modules from props.stripes.discovery.modules, then
   * request /_/proxy/modules/$i and parse the result to find the list of
   * paths supported by each implementation and store the result in state.
   */
  componentDidMount() {
    const { stripes } = this.props;

    const paths = this.state.paths;
    const token = stripes.store.getState().okapi.token;

    const options = {
      method: 'GET',
      headers: {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        ...(token && { 'X-Okapi-Token': token }),
        'Content-Type': 'application/json',
      },
    };

    fetch(`${stripes.okapi.url}/_/proxy/tenants/${stripes.okapi.tenant}/modules?full=true `, options)
      .then((res) => {
        if (res.ok) {
          res.json().then((modules => {
            modules.forEach(impl => {
              const iface = this.implToInterface(impl.id);
              if (impl.provides) {
                // not all interfaces actually implement routes, e.g. edge-connexion
                // so those must be filtered out
                impl.provides.filter(i => i.handlers).forEach(i => {
                  i.handlers.forEach(handler => {
                    paths[handler.pathPattern] = {
                      iface,
                      impl,
                      ramlsLink: <a href={`//github.com/folio-org/${iface}/tree/master/ramls`}>{iface}</a>,
                    };
                  });
                });
              }
            });
            this.setState({ paths });
          }));
        }
      });
  }

  /**
   * map a module implementation string to an interface, hopefully.
   * given a string like "mod-users-16.2.0-SNAPSHOT.127" return "mod-users"
   */
  implToInterface(impl) {
    const iface = impl.match(/^(.*)-[0-9].*/);
    return iface[1] ? iface[1] : '';
  }

  /**
   * iterate through this.state.paths to find those matching this.state.filter
   * and return an array of nicely formatted <li> elements
   */
  showPaths = () => {
    // dear ESLint: I just want you to know that
    //   <li key={path}>{path} = {this.state.paths[path].ramlsLink}</li>);
    // is SO MUCH CLEARER than
    //         <li key={path}>
    //            {path}
    //            =
    //            {this.state.paths[path].ramlsLink}
    //          </li>
    // AND it actually formats the way I want, with spaces around the equals.
    // Sometimes, and I hate to tell it to you this way, you suck at your job.
    return Object
      .keys(this.state.paths)
      .sort()
      .filter(path => path.indexOf(this.state.filter) >= 0)
      .map(path => <li key={path}>{path} = {this.state.paths[path].ramlsLink}</li>); // eslint-disable-line
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
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
};

export default stripesConnect(OkapiPaths);
