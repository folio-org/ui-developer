import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane, Pane } from '@folio/stripes/components';


// Alphabetical sort, but with items beginning 'SYS#' at the end
function permNameCmp(a, b) {
  if (a.startsWith('SYS#') && !b.startsWith('SYS#')) return 1;
  if (b.startsWith('SYS#') && !a.startsWith('SYS#')) return -1;
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}


function SinglePermission({ permName, name2perm }) {
  const perm = name2perm[permName];
  const [expanded, setExpanded] = useState(false);

  return (
    <span>
      <span
        style={{
          cursor: 'pointer',
          color: perm.visible ? 'black' : '#888',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span
          style={{
            fontSize: '12px',
            marginRight: '3px',
            color: 'rgb(110, 110, 110)',
          }}
        >
          {expanded ? '▼' : '▶'}
        </span>
        {' '}
        {perm.permissionName}
        {perm.displayName && (
          <>{' '}(<i>{perm.displayName}</i>)</>
        )}
      </span>
      {expanded &&
        <span>
          {perm.description &&
            <div style={{ margin: '0.5em 1.5em' }}>{perm.description}</div>
          }
          {perm.subPermissions.length > 0 &&
            <PermissionsList permNames={perm.subPermissions.sort(permNameCmp)} name2perm={name2perm} />
          }
        </span>
      }
    </span>
  );
}

SinglePermission.propTypes = {
  permName: PropTypes.string.isRequired,
  name2perm: PropTypes.objectOf(
    PropTypes.object.isRequired,
  ).isRequired,
};


function PermissionsList({ permNames, name2perm }) {
  return (
    <ul style={{ listStyleType: 'none' }}>
      {permNames.map(permName => (
        <li key={permName}>
          <SinglePermission permName={permName} name2perm={name2perm} />
        </li>
      ))}
    </ul>
  );
}

PermissionsList.propTypes = {
  permNames: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  name2perm: PropTypes.objectOf(
    PropTypes.object.isRequired,
  ).isRequired,
};


const PermissionsInspector = ({ resources }) => {
  const { perms } = resources;
  if (!perms.hasLoaded) return <LoadingPane />;

  const name2perm = {};
  perms.records.forEach(perm => {
    name2perm[perm.permissionName] = perm;
  });

  const permNames = Object.keys(name2perm).sort(permNameCmp).filter(permName => name2perm[permName].visible);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.permissionsInspector" />}
    >
      <h3>
        <FormattedMessage
          id="ui-developer.perms-inspector.counts"
          values={{
            allCount: perms.other.totalRecords,
            visibleCount: perms.records.filter(perm => perm.visible).length,
          }}
        />
      </h3>
      <PermissionsList permNames={permNames} name2perm={name2perm} />
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
