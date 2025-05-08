import { useCallback } from 'react';

import { useOkapiKy } from '@folio/stripes/core';

const useUsers = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchUsers = useCallback((searchParams) => ky.get('users', { searchParams }).json(), [ky]);

  return {
    fetchUsers,
  };
};

export default useUsers;
