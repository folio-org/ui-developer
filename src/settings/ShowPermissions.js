import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane, List } from '@folio/stripes/components';

const ShowPermissions = (props) => {
  const { stripes } = props;
  const currentPerms = stripes.user ? stripes.user.perms : {};
  const perms = Object.keys(currentPerms).sort();

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

ShowPermissions.propTypes = {
  stripes: PropTypes.shape({
    user: PropTypes.shape({
      perms: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ShowPermissions;
