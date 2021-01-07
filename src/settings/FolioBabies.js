import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  List,
} from '@folio/stripes/components';

const FolioBabies = () => {
  const babies = [
    'Alina',
    'Anton & Fiete',
    'Benjamin',
    'Ethan',
    'Filip',
    'Josephine',
    'Maeve',
    'Aahana',
    'Shreya',
    'Maria',
    'Julian',
  ];

  babies.sort();

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.folioBabies" />}
    >
      <List
        listStyle="bullets"
        items={babies}
      />
    </Pane>
  );
};

export default FolioBabies;
