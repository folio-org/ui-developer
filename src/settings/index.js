import React from 'react';
import { hot } from 'react-hot-loader';
import { FormattedMessage, useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import Configuration from './Configuration';
import ShowPermissions from './ShowPermissions';
import Locale from './Locale';
import OkapiPaths from './OkapiPaths';
import CanIUse from './CanIUse';
import TestHotkeys from './TestHotkeys';
import Token from './Token';
import FolioBabies from './FolioBabies';
import OkapiConfiguration from './OkapiConfiguration';

const pages = [
  {
    route: 'configuration',
    labelId: 'ui-developer.configuration',
    component: Configuration,
    perm: 'ui-developer.settings.configuration',
  },
  {
    route: 'perms',
    labelId: 'ui-developer.perms',
    component: ShowPermissions,
    perm: 'ui-developer.settings.perms',
  },
  {
    route: 'hotkeys',
    labelId: 'ui-developer.hotkeys',
    component: TestHotkeys,
    perm: 'ui-developer.settings.hotkeys',
  },
  {
    route: 'token',
    labelId: 'ui-developer.setToken',
    component: Token,
    perm: 'ui-developer.settings.token',
  },
  {
    route: 'locale',
    labelId: 'ui-developer.sessionLocale',
    component: Locale,
    perm: 'ui-developer.settings.locale',
  },
  {
    route: 'okapi-paths',
    labelId: 'ui-developer.okapiPaths',
    component: OkapiPaths,
  },
  {
    route: 'can-i-use',
    labelId: 'ui-developer.canIUse',
    component: CanIUse,
  },
  {
    route: 'folio-babies',
    labelId: 'ui-developer.folioBabies',
    component: FolioBabies,
  },
  {
    route: 'okapi-configuration',
    labelId: 'ui-developer.okapiConfigurationEntries',
    component: OkapiConfiguration,
    perm: 'ui-developer.settings.okapiConfiguration',
  },
];

const DeveloperSettings = (props) => {
  const intl = useIntl();

  pages.forEach(p => {
    p.label = intl.formatMessage({ id: p.labelId });
  });

  pages.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  return <Settings {...props} pages={pages} paneTitle={<FormattedMessage id="ui-developer.meta.title" />} />;
};

export default hot(module)(DeveloperSettings);
