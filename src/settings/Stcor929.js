import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  Pane,
  List,
} from '@folio/stripes/components';

const Stcor929 = () => {
  const ky = useOkapiKy();

  const {
    isFetching,
    isFetched,
    isLoading,
    data,
  } = useQuery(
    ['@folio/developer', 'STCOR-929'],
    ({ signal }) => {
      return ky.get(
        `users?limit=10`,
        { signal },
      ).json();
    },
    {
      refetchInterval: 3000
    }
    );

  if (data) {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.STCOR-929" />}
      >
        <List
          listStyle="bullets"
          items={data.users.map(i => i.username)}
        />
      </Pane>
    );

  }

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.folioBabies" />}
    >
      <h2>No data yet</h2>
    </Pane>
  );


};

export default Stcor929;
