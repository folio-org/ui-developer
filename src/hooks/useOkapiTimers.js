import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useOkapiTimers = (tenant) => {
  const ky = useOkapiKy();
  const { data, isLoading } = useQuery(
    {
      queryKey: ['crontab'],
      queryFn: () => ky.get(`_/proxy/tenants/${tenant}/timers`).then(response => response.json()),
    },
  );

  return { data, isLoading };
};

export default useOkapiTimers;
