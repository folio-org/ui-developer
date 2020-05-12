import React from 'react';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import Configuration from './Configuration';
import Locale from './Locale';
import OkapiPaths from './OkapiPaths';
import CanIUse from './CanIUse';
import TestHotkeys from './TestHotkeys';
import Token from './Token';

const pages = [
  {
    route: 'configuration',
    label: <FormattedMessage id="ui-developer.configuration" />,
    component: Configuration,
    perm: 'ui-developer.settings.configuration',
  },
  {
    route: 'hotkeys',
    label: <FormattedMessage id="ui-developer.hotkeys" />,
    component: TestHotkeys,
    perm: 'ui-developer.settings.hotkeys',
  },
  {
    route: 'token',
    label: <FormattedMessage id="ui-developer.setToken" />,
    component: Token,
    perm: 'ui-developer.settings.token',
  },
  {
    route: 'locale',
    label: <FormattedMessage id="ui-developer.sessionLocale" />,
    component: Locale,
    perm: 'ui-developer.settings.locale',
  },
  {
    route: 'okapi-paths',
    label: <FormattedMessage id="ui-developer.okapiPaths" />,
    component: OkapiPaths,
  },
  {
    route: 'can-i-use',
    label: <FormattedMessage id="ui-developer.canIUse" />,
    component: CanIUse,
  },
];

class DeveloperSettings extends React.Component {
  static actionNames = ['stripesHome', 'stripesAbout'];

  render() {
    return <Settings {...this.props} pages={pages} paneTitle={<FormattedMessage id="ui-developer.meta.title" />} />;
  }
}

export default hot(module)(DeveloperSettings);
