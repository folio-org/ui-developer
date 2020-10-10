import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Pane,
} from '@folio/stripes/components';

/**
 * given a partial path, find the API endpoints that match it
 * and list the required permissions to access each. Click a
 * permission to retrieve the publicly accessible permission sets
 * that contain it.
 *
 * i.e. given an endpoint, tell me what permissions I need to access it.
 */
class CanIUse extends React.Component {
  static manifest = Object.freeze({
    moduleDetails: {
      type: 'okapi',
      accumulate: true,
      fetch: false,
    },
    permissions: {
      type: 'okapi',
      accumulate: true,
      fetch: false,
      path: 'perms/permissions',
    },
    moduleId: '',
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      moduleDetails: PropTypes.object,
      permissions: PropTypes.object,
      moduleId: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      moduleDetails: PropTypes.object,
      permissions: PropTypes.object,
    }),
  };


  constructor() {
    super();
    this.state = {
      paths: {},
      permissionSets: {},
      filter: '',
      publicPermissions: [],
    };
  }

  /**
   * read the list of modules from props.stripes.discovery.modules, then
   * request /_/proxy/tenants/${tenant}/modules/$i and parse the result to find the list of
   * paths supported by each implementation and store the result in state.
   */
  componentDidMount() {
    const { mutator, stripes } = this.props;

    const options = {
      method: 'GET',
      headers: {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        'X-Okapi-Token': stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      },
    };
    fetch(`${stripes.okapi.url}/_/proxy/tenants/${stripes.okapi.tenant}/modules?full=true `, options)
      .then((res) => {
        if (res.ok) {
          res.json().then((modules => {
            const paths = this.state.paths;
            const permissionSets = this.state.permissionSets;
            modules.forEach(impl => {
              this.mapPathToImpl(impl, paths);
              this.mapPermissionSetToPermissions(impl, permissionSets);
              this.setState({ paths, permissionSets });
            });
          }));
        }
      });
  }

  /**
   * Find visible psets containing state.desiredPermission.
   *
   * This isn't perfect as it only looks two levels up in the hierarchy,
   * but it's better than nothing. We look for a pset containing desiredPermission
   * as a subPermission. If that container is itself visible or has parents that
   * are visible, they are saved in state.publicPermissions.
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.desiredPermission && this.state.desiredPermission !== prevState.desiredPermission) {
      const { mutator } = this.props;
      mutator.permissions.GET({ params: { query: `(subPermissions=${this.state.desiredPermission})` } }).then(subRes => {
        const parents = {};
        subRes.permissions.forEach(p => {
          if (p.childOf) {
            p.childOf.forEach(c => {
              parents[c] = true;
            });
          }
          if (p.visible) {
            parents[p.permissionName] = true;
          }
        });

        if (Object.keys(parents).length) {
          mutator.permissions.GET({ params: { query: `(permissionName=(${Object.keys(parents).map(i => `"${i}"`).join(' or ')}) and visible=true)` } }).then(pRes => {
            this.setState({ publicPermissions: pRes.permissions });
          });
        }
      });
    }
  }

  mapPathToImpl = (impl, paths) => {
    const iface = this.implToInterface(impl.id);
    if (impl.provides) {
      impl.provides.forEach(i => {
        i.handlers.forEach(handler => {
          if (!paths[handler.pathPattern]) {
            paths[handler.pathPattern] = {
              iface,
              impl,
              ramlsLink: <a href={`//github.com/folio-org/${iface}/tree/master/ramls`}>{iface}</a>,
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

    return <div>requires one of: {this.linkFormatter(this.state.paths[path].permissions)}</div>;
  }

  linkFormatter = (l) => <ul>{l.map(i => <li key={i}><tt><button type="button" onClick={() => this.handlePermissionClick(i)}>{i}</button></tt></li>)}</ul>;

  showPublicPermissions = () => {
    return (
      <div>
        <h4>{this.state.desiredPermission} is available in the following public permission sets:</h4>
        <ul>{this.state.publicPermissions.map(p => <li key={p.permissionName}>{this.formatPermissionName(p.permissionName)} ({p.permissionName})</li>)}</ul>
      </div>
    );
  }

  formatPermissionName = (name) => {
    const [id, ...rest] = name.split('.');
    return <FormattedMessage id={`${id}.permission.${rest.join('.')}`} />;
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
      .map(path => <li key={path}>{path} = {this.state.paths[path].ramlsLink}{this.showPublicPsetsFor(path)}</li>); // eslint-disable-line
  }


  handleFilter = (event) => {
    this.setState({ filter: event.target.value });
  }

  handlePermissionClick = (desiredPermission) => {
    this.setState({ desiredPermission, publicPermissions: [] });
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
        <div>{this.showPublicPermissions()}</div>
        <div>
          <h4>matched paths</h4>
          <ul>
            {this.showPaths()}
          </ul>
        </div>
      </Pane>
    );
  }
}

CanIUse.propTypes = {
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(CanIUse);
