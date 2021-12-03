import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Pane, ButtonGroup, Button } from '@folio/stripes/components';
import Configuration from './Configuration';
import Environment from './Environment';
import Modules from './Modules';
import Interfaces from './Interfaces';


const pages = [
  { tab: 'configuration', component: Configuration },
  { tab: 'environment', component: Environment },
  { tab: 'modules', component: Modules },
  { tab: 'interfaces', component: Interfaces },
];


function OkapiConsole() {
  const [tab, setTab] = useState('configuration');
  const Component = pages.find(p => p.tab === tab).component;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.okapiConsole" />}
    >
      <ButtonGroup>
        {
          pages.map(page => (
            <Button
              key={page.tab}
              buttonStyle={`${page.tab === tab ? 'primary' : 'default'}`}
              id={`segment-page-${page.tab}`}
              onClick={() => setTab(page.tab)}
            >
              <FormattedMessage id={`ui-developer.okapiConsole.${page.tab}`} />
            </Button>
          ))
        }
      </ButtonGroup>
      <Component />
    </Pane>
  );
}


export default OkapiConsole;
