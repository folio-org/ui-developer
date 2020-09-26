import React from 'react';
import PropTypes from 'prop-types';
import GraphiQL from 'graphiql';
import queryString from 'query-string';
import { injectIntl } from 'react-intl';

import '!style-loader!css-loader!graphiql/graphiql.css'; // eslint-disable-line import/no-webpack-loader-syntax

import {
  IconButton,
  Layer,
  Pane,
  Paneset,
  PaneMenu,
} from '@folio/stripes/components';

/**
 * Send a graphql query directly to Okapi, i.e. be Postman, or cURL, or however
 * you want to think of it.
 *
 * This implementation just hands everything off to GraphiQL, loading it in
 * a <Layer> because that's the easiest way to go full screen without having
 * to reengineer the entire settings page that currently relies on <Settings>
 * and <EntryManager>.
 *
 */
class OkapiGraphQLQuery extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        url: PropTypes.string.isRequired,
        tenant: PropTypes.string.isRequired,
      }).isRequired,
      store: PropTypes.object.isRequired,
    }).isRequired,
  };

  /**
   * on-mount, add '?layer=graphql' to the history, causing GraphiQL to open
   * in a <Layer>.
   */
  componentDidMount() {
    const { location, history } = this.props;
    history.push(`${location.pathname}?layer=graphql`);
  }

  /**
   * when the layer is closed, push a new history element that pops the current
   * location off, effectively returning to the main dev-settings page.
   */
  onCancel = (e) => {
    const { location, history } = this.props;
    e.preventDefault();
    history.push(location.pathname.substr(0, location.pathname.lastIndexOf('/')));
  }

  /**
   * http request handler for GraphiQL
   */
  fetcher = (graphQLParams) => {
    const { stripes } = this.props;
    return fetch(`${stripes.okapi.url}/graphql`, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Okapi-Tenant': stripes.okapi.tenant,
        'X-Okapi-Token': stripes.store.getState().okapi.token,
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  };

  render() {
    const { intl, location } = this.props;

    const defaultQuery = [
      '# query {',
      '#   users {',
      '#     users {id username { personal { firstName lastName }}}',
      '#   }',
      '# }',
      '#',
      '# query {',
      '#   instance_storage_instances(limit:1, query:"title=water") {',
      '#     instances {id hrid title}',
      '#   }',
      '# }'
    ];

    const cancelButton = (
      <PaneMenu>
        <IconButton
          icon="times"
          size="medium"
          iconClassName="closeIcon"
          aria-label={intl.formatMessage({ id: 'stripes-core.button.cancel' })}
          onClick={this.onCancel}
        />
      </PaneMenu>
    );
    const container = document.getElementById('ModuleContainer');
    const query = location.search ? queryString.parse(location.search) : {};

    return (
      <Layer
        isOpen={!!(query.layer)}
        contentLabel={intl.formatMessage({ id: 'ui-developer.okapiGraphQLQuery' })}
        container={container}
      >
        <Paneset isRoot>
          <Pane
            paneWidth="fill"
            defaultWidth="100%"
            paneTitle={intl.formatMessage({ id: 'ui-developer.okapiGraphQLQuery' })}
            firstMenu={cancelButton}
          >
            <GraphiQL fetcher={this.fetcher} defaultQuery={defaultQuery.join('\n')} />
          </Pane>
        </Paneset>
      </Layer>
    );
  }
}

export default injectIntl(OkapiGraphQLQuery);
