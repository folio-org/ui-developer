import {
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useSchedulerTimers = () => {
  const [namespace] = useNamespace();
  const ky = useOkapiKy();

  const searchParams = {
    // limit imposed by the API; > 500 generates an error
    limit: 500, 
  };

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespace, 'schedulerTimers'],
      queryFn: () => ky.get('scheduler/timers', { searchParams })
        .then(response => response.json()),
    },
  );

  return { data, isLoading };
};

export default useSchedulerTimers;
