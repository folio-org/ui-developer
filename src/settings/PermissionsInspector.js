import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, LoadingPane, NoValue } from '@folio/stripes/components';
import ObjectInspector from 'react-inspector';


// Alphabetical sort, but with items beginning 'SYS#' at the end
function permNameCmp(a, b) {
  if (a.startsWith('SYS#') && !b.startsWith('SYS#')) return 1;
  if (b.startsWith('SYS#') && !a.startsWith('SYS#')) return -1;
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}

function compilePermissions(list) {
  const name2perm = {};
  list.forEach(perm => {
    name2perm[perm.permissionName] = {
      // XXX This is a clumsy way to get the permissions rendered the way we want
      constructor: {
        name: (
          <span>
            <b>{perm.permissionName}</b>
            {' '}
            ({perm.displayName || <NoValue />})
          </span>
        ),
      },
      subPermissions: perm.subPermissions,
    };
  });

  Object.keys(name2perm).forEach(permName => {
    const perm = name2perm[permName];
    perm.subPermissions = perm.subPermissions.sort(permNameCmp).map(name => name2perm[name]);
  });

  return Object.keys(name2perm).sort(permNameCmp).map(name => name2perm[name]);
}


const PermissionsInspector = ({ resources }) => {
  const { perms } = resources;
  if (!perms.hasLoaded) return <LoadingPane />;

  const data = compilePermissions(perms.records);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.permissionsInspector" />}
    >
      <h3>
        <FormattedMessage id="ui-developer.perms.permissionCount" values={{ count: perms.other.totalRecords }} />
      </h3>
      <ObjectInspector
        data={data}
        expandLevel={1}
      />
    </Pane>
  );
};

PermissionsInspector.manifest = Object.freeze({
  perms: {
    type: 'okapi',
    path: 'perms/permissions',
    params: { length: '9999' },
    records: 'permissions',
  },
});

PermissionsInspector.propTypes = {
  resources: PropTypes.shape({
    perms: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
      }),
      records: PropTypes.arrayOf(
        PropTypes.shape({
          permissionName: PropTypes.string.isRequired,
          displayName: PropTypes.string,
          description: PropTypes.string,
          moduleName: PropTypes.string.isRequired,
          subPermissions: PropTypes.arrayOf(
            PropTypes.string.isRequired,
          ).isRequired,
        }).isRequired
      ),
    }).isRequired
  }).isRequired,
};

export default stripesConnect(PermissionsInspector);
