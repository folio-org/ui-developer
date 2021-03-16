import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Pane, List } from '@folio/stripes/components';

const ShowPermissions = (props) => {
  const { stripes, resources } = props;
  const currentPerms = stripes.user ? stripes.user.perms : {};

  const id2name = {};
  resources.permissions.records.forEach(perm => {
    id2name[perm.permissionName] = perm.displayName;
  });

  const perms = Object.keys(currentPerms).sort().map(key => (
    <><b>{key}</b> ({id2name[key]})</>
  ));

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.perms" />}
    >
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
