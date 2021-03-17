import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Pane, Checkbox, List } from '@folio/stripes/components';

const ShowPermissions = (props) => {
  const [visibleOnly, setVisibleOnly] = useState(false);
  const [showDisplayName, setShowDisplayName] = useState(true);
  const { stripes, resources } = props;
  const currentPerms = stripes.user ? stripes.user.perms : {};

  const id2perm = {};
  resources.permissions.records.forEach(perm => {
    id2perm[perm.permissionName] = perm;
  });

  const perms = Object.keys(currentPerms).sort()
    .filter(key => !visibleOnly || id2perm[key]?.visible)
    .map(key => (
      showDisplayName ?
        <><b>{key}</b> &mdash; {id2perm[key]?.displayName}</> :
        <b>{key}</b>
    ));

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.perms" />}
    >
      <div>
        <Checkbox
          checked={visibleOnly}
          data-test-checkbox-visible-only
          label={<FormattedMessage id="ui-developer.perms.visibleOnly" />}
          onChange={e => setVisibleOnly(e.target.checked)}
        />
        <Checkbox
          checked={showDisplayName}
          data-test-checkbox-visible-only
          label={<FormattedMessage id="ui-developer.perms.showDisplayName" />}
          onChange={e => setShowDisplayName(e.target.checked)}
        />
      </div>
      <h3>
        <FormattedMessage id="ui-developer.perms.permissionCount" values={{ count: perms.length }} />
      </h3>
      <List
        listStyle="bullets"
        items={perms}
      />
    </Pane>
  );
};

ShowPermissions.manifest = Object.freeze({
  permissions: {
    type: 'okapi',
    path: 'perms/permissions',
    params: { length: '9999' },
    records: 'permissions',
  },
});

ShowPermissions.propTypes = {
  stripes: PropTypes.shape({
    user: PropTypes.shape({
      perms: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    permissions: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

export default stripesConnect(ShowPermissions);
