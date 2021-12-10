import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
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


function OkapiConsole({ resources, mutator }) {
  const tab = resources.query.tab || 'configuration';
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
              onClick={() => mutator.query.update({ tab: page.tab })}
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


OkapiConsole.manifest = {
  query: {},
};


OkapiConsole.propTypes = {
  resources: PropTypes.shape({
    query: PropTypes.shape({
      tab: PropTypes.string,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }),
};


export default stripesConnect(OkapiConsole);
