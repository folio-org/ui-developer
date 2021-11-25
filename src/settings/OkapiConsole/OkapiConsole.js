import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Pane, ButtonGroup, Button } from '@folio/stripes/components';
import Parameters from './Parameters';
import Environment from './Environment';
import Modules from './Modules';


const pages = [
  { tab: 'parameters', component: Parameters },
  { tab: 'environment', component: Environment },
  { tab: 'modules', component: Modules },
];


function OkapiConsole() {
  const [version, setVersion] = useState();
  const [tab, setTab] = useState('parameters');
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
