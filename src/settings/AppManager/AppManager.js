import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, ButtonGroup, Button } from '@folio/stripes/components';
import Apps from './Apps';
import Sources from './Sources';


const pages = [
  { tab: 'apps', component: Apps },
  { tab: 'sources', component: Sources },
];


function AppManager({ resources, mutator }) {
  const tab = resources.query.tab || 'apps';
  const Component = pages.find(p => p.tab === tab).component;

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.app-manager" />}
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
              <FormattedMessage id={`ui-developer.app-manager.${page.tab}`} />
            </Button>
          ))
        }
      </ButtonGroup>
      <Component />
    </Pane>
  );
}


AppManager.manifest = {
  query: {},
};


AppManager.propTypes = {
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


export default stripesConnect(AppManager);
