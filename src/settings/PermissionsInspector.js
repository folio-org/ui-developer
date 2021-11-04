import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane, Pane, Checkbox } from '@folio/stripes/components';
import { getPermissionLabelString } from '../util/permission';


// Alphabetical sort, but with items beginning 'SYS#' at the end
function permNameCmp(a, b) {
  if (a.startsWith('SYS#') && !b.startsWith('SYS#')) return 1;
  if (b.startsWith('SYS#') && !a.startsWith('SYS#')) return -1;
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}


function SinglePermission({ permName, name2perm }) {
  const intl = useIntl();
  const perm = name2perm[permName];
  const [expanded, setExpanded] = useState(false);
  const displayName = getPermissionLabelString(perm, intl.formatMessage);

  return (
    <span>
      <button
        type="button"
        style={{
          textAlign: 'left',
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
        {displayName && (
          <>{' '}(<i>{displayName}</i>)</>
        )}
      </button>
      {expanded &&
        <span>
          {perm.moduleName &&
            <div style={{ margin: '0.5em 1.5em' }}>
              <FormattedMessage
                id="ui-developer.permissionsInspector.fromModule"
                values={{
                  name: perm.moduleName,
                  code: chunks => <code>{chunks}</code>,
                }}
              />
            </div>
          }
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
  const [includeInvisible, setIncludeInvisible] = useState(false);
  const { perms } = resources;
  if (!perms.hasLoaded) return <LoadingPane />;

  const name2perm = {};
  perms.records.forEach(perm => {
    name2perm[perm.permissionName] = perm;
  });

  const permNames = Object.keys(name2perm)
    .sort(permNameCmp)
    .filter(permName => includeInvisible || name2perm[permName].visible);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.permissionsInspector" />}
    >
      <Checkbox
        checked={includeInvisible}
        data-test-checkbox-include-invisible
        label={<FormattedMessage id="ui-developer.perms-inspector.showInvisible" />}
        onChange={e => setIncludeInvisible(e.target.checked)}
      />
      <h3>
        <FormattedMessage
          id="ui-developer.perms-inspector.counts"
          values={{
            allCount: perms.other.totalRecords,
            visibleCount: perms.records.filter(perm => perm.visible).length,
            invisibleCount: perms.records.filter(perm => !perm.visible).length,
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
          moduleName: PropTypes.string,
          subPermissions: PropTypes.arrayOf(
            PropTypes.string.isRequired,
          ).isRequired,
        }).isRequired
      ),
    }).isRequired
  }).isRequired,
};

export default stripesConnect(PermissionsInspector);
