import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
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
  const [version, setVersion] = useState();
  const [tab, setTab] = useState('configuration');
  const okapiKy = useOkapiKy();
  const Component = pages.find(p => p.tab === tab).component;

  useEffect(() => {
    okapiKy('_/version').then(async res => {
      const text = await res.text();
      setVersion(text);
    });
  });

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.okapiConsole" />}
    >
      <h3>Okapi version {version}</h3>
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
