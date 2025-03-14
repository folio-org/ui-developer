import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import Configuration from './Configuration';
import ShowPermissions from './ShowPermissions';
import SessionLocale from './SessionLocale';
import OkapiPaths from './OkapiPaths';
import CanIUse from './CanIUse';
import FolioBabies from './FolioBabies';
import OkapiConfiguration from './OkapiConfiguration';
import Passwd from './Passwd';
import OkapiQuery from './OkapiQuery';
import Dependencies from './Dependencies';
import Translations from './Translations';
import PluginSurface from './PluginSurface';
import HandlerSurface from './HandlerSurface';
import StripesInspector from './StripesInspector';
import PermissionsInspector from './PermissionsInspector';
import OkapiConsole from './OkapiConsole';
import UserLocale from './UserLocale';
import OkapiTimers from './OkapiTimers';
import AppManager from './AppManager';
import RefreshTokenRotation from './RefreshTokenRotation';
import ShowCapabilities from './ShowCapabilities';

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
    route: 'locale',
    labelId: 'ui-developer.sessionLocale',
    component: SessionLocale,
    perm: 'ui-developer.settings.locale',
  },
  {
    route: 'okapi-paths',
    labelId: 'ui-developer.okapiPaths',
    component: OkapiPaths,
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
  {
    route: 'passwd',
    labelId: 'ui-developer.passwd',
    component: Passwd,
    perm: 'ui-developer.settings.passwd',
  },
  {
    route: 'okapi-query',
    labelId: 'ui-developer.okapiQuery',
    component: OkapiQuery,
    perm: 'ui-developer.settings.okapiQuery',
  },
  {
    route: 'dependencies',
    labelId: 'ui-developer.dependencies',
    component: Dependencies,
    perm: 'ui-developer.settings.dependencies',
  },
  {
    route: 'translations',
    labelId: 'ui-developer.translations',
    component: Translations,
    perm: 'ui-developer.settings.translations',
  },
  {
    route: 'plugin-surface',
    labelId: 'ui-developer.plugin-surface',
    component: PluginSurface,
    perm: 'ui-developer.settings.plugin-surface',
  },
  {
    route: 'handler-surface',
    labelId: 'ui-developer.handler-surface',
    component: HandlerSurface,
    perm: 'ui-developer.settings.handler-surface',
  },
  {
    route: 'stripes-inspector',
    labelId: 'ui-developer.stripesInspector',
    component: StripesInspector,
    perm: 'ui-developer.settings.stripesInspector',
  },
  {
    route: 'okapi-console',
    labelId: 'ui-developer.okapiConsole',
    component: OkapiConsole,
    perm: 'ui-developer.settings.okapiConsole',
  },
  {
    route: 'user-locale',
    labelId: 'ui-developer.userLocale',
    component: UserLocale,
    perm: 'ui-developer.settings.userLocale',
  },
  {
    route: 'okapi-timers',
    labelId: 'ui-developer.okapiTimers',
    component: OkapiTimers,
    perm: 'ui-developer.settings.okapiTimers',
  },
  {
    route: 'rtr',
    labelId: 'ui-developer.rtr',
    component: RefreshTokenRotation,
    perm: 'ui-developer.settings.rtr',
  },

];

const DeveloperSettings = (props) => {
  const stripes = useStripes();
  const intl = useIntl();

  const allPages = [...pages];
  if (stripes.hasInterface('app-manager')) {
    allPages.push({
      route: 'app-manager',
      labelId: 'ui-developer.app-manager',
      component: AppManager,
      // perm: 'ui-developer.settings.app-manager',
    });
  }

  if (stripes.hasInterface('capabilities') || stripes.hasInterface('capability-sets')) {
    allPages.push({
      route: 'capabilities',
      labelId: 'ui-developer.canIUseCapabilities',
      component: ShowCapabilities,
    });
  }

  if (!stripes.hasInterface('roles')) {
    allPages.push({
      route: 'permissions-inspector',
      labelId: 'ui-developer.permissionsInspector',
      component: PermissionsInspector,
      perm: 'ui-developer.settings.permissionsInspector',
    });
    allPages.push({
      route: 'can-i-use',
      labelId: 'ui-developer.canIUse',
      component: CanIUse,
    });
  }

  allPages.forEach(p => {
    p.label = intl.formatMessage({ id: p.labelId });
  });

  allPages.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  return <Settings {...props} pages={allPages} paneTitle={<FormattedMessage id="ui-developer.meta.title" />} />;
};

export default DeveloperSettings;
