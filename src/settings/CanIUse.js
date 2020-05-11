import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  Pane,
} from '@folio/stripes/components';

/**
 * fetch the paths associated with the available interfaces to provide a way
 * to figure out which path is provided by which interface.
 */
class CanIUse extends React.Component {
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
      permissionSets: {},
      filter: '',
    };
  }

  /**
   * read the list of modules from props.stripes.discovery.modules, then
   * request /_/proxy/modules/$i and parse the result to find the list of
   * paths supported by each implementation and store the result in state.
   */
  componentDidMount() {
    const { mutator } = this.props;

    const modules = get(this.props.stripes, ['discovery', 'modules']) || {};

    const paths = this.state.paths;
    const permissionSets = this.state.permissionSets;
    Object.keys(modules).forEach(impl => {
      mutator.moduleDetails.GET({ path: `_/proxy/modules/${impl}` }).then(res => {
        this.mapPathToImpl(res, impl, paths);
        this.mapPermissionSetToPermissions(res, permissionSets);
        this.setState({ paths, permissionSets });
      });
    });
  }

  mapPathToImpl = (res, impl, paths) => {
    const iface = this.implToInterface(impl);
    if (res.provides) {
      res.provides.forEach(i => {
        i.handlers.forEach(handler => {
          if (!paths[handler.pathPattern]) {
            paths[handler.pathPattern] = {
              iface,
              impl,
              ramlsLink: <Link to={`//github.com/folio-org/${iface}/tree/master/ramls`}>{iface}</Link>,
              permissions: [],
            };
          }
          if (handler.permissionsRequired) {
            handler.permissionsRequired.forEach(p => {
              paths[handler.pathPattern].permissions.push(p);
            });
          }
        });
      });
    }
  }

  mapPermissionSetToPermissions = (res, permissionSets) => {
    if (res.permissionSets) {
      res.permissionSets.forEach(pset => {
        permissionSets[pset.permissionName] = {
          subPermissions: pset.subPermissions,
          visible: pset.visible !== false,
        };
      });
    }
  }

  /**
   * map a module implementation string to an interface, hopefully.
   * given a string like "mod-users-16.2.0-SNAPSHOT.127" return "mod-users"
   */
  implToInterface(impl) {
    const iface = impl.match(/^(.*)-[0-9].*/);
    return iface[1] ? iface[1] : '';
  }

  showPublicPsetsFor = (path) => {
    if (this.state.filter === '') {
      return '';
    }

    const psets = {};

    if (this.state.paths[path].permissions) {
      this.state.paths[path].permissions.forEach(p => {
        // search top-level permission sets
        if (this.state.permissionSets[p] && this.state.permissionSets[p].visible) {
          psets[p] = true;
        }

        Object.entries(this.state.permissionSets).forEach(([key, val]) => {
          if (val.subPermissions) {
            val.subPermissions.forEach(subP => {
              if (p === subP) {
                psets[key] = true;
              }
            });
          }
        });
      });
    }

    return <div>requires one of: {this.listFormatter(this.state.paths[path].permissions)} publicly available in {this.listFormatter(Object.keys(psets))}</div>;
//    return <div>may require <tt>{this.state.paths[path].permissions.join(', ')}</tt>, publicly available in <tt>{Object.keys(psets).join(', ')}</tt></div>;
    //this.state.paths[path].permissions ? this.state.paths[path].permissions.join(', ') : '';
  }

  listFormatter = (l) => <ul>{l.map(i => <li key={i}><tt>{i}</tt></li>)}</ul>;

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
      .map(path => <li key={path}>{path} = {this.state.paths[path].ramlsLink}{this.showPublicPsetsFor(path)}</li>); // eslint-disable-line
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
          <h3>resource path to permission-set mapper</h3>
          <input type="text" name="" onChange={this.handleFilter} />
        </div>
        <ul>
          {this.showPaths()}
        </ul>
      </Pane>
    );
  }
}

CanIUse.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(CanIUse);
