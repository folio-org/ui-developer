import React from 'react';
import { hot } from 'react-hot-loader';
import { Settings } from '@folio/stripes/smart-components';

import Configuration from './Configuration';
import Locale from './Locale';
import TestHotkeys from './TestHotkeys';
import Token from './Token';

const pages = [
  {
    route: 'configuration',
    label: 'Configuration',
    component: Configuration,
  },
  {
    route: 'hotkeys',
    label: 'Hotkeys Test',
    component: TestHotkeys,
  },
  {
    route: 'token',
    label: 'Set Token',
    component: Token,
  },
  {
    route: 'locale',
    label: 'Session locale',
    component: Locale,
  },
];

class DeveloperSettings extends React.Component {
  static actionNames = ['stripesHome', 'stripesAbout'];

  render() {
    return <Settings {...this.props} pages={pages} paneTitle="Developer" />;
  }
}

export default hot(module)(DeveloperSettings);
