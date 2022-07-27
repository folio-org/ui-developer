import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStripes } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';


// Below, we pass the prop clientGeneratePk="" into <ControlledVocab>
// to prevent stripes-connected from generating its own `id` on the
// client side, because we want the back-end module to generate the
// key. Passing the value {false} is no good, because that doesn't
// register as sufficiently set to be passed through into
// stripes-connect in a string context.

class Sources extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { stripes, intl } = this.props;

    return (
      <Paneset isRoot>
        <this.connectedControlledVocab
          stripes={stripes}
          baseUrl="app-manager/config/sources"
          label={intl.formatMessage({ id: 'ui-developer.app-manager.sources.plural' })}
          listFormLabel=" "
          labelSingular={intl.formatMessage({ id: 'ui-developer.app-manager.sources.singular' })}
          objectLabel={intl.formatMessage({ id: 'ui-developer.app-manager.sources.objectLabel' })}
          visibleFields={['owner', 'repo', 'tokenStart', 'tokenEnd']}
          columnMapping={{
            owner: intl.formatMessage({ id: 'ui-developer.app-manager.sources.heading.owner' }),
            repo: intl.formatMessage({ id: 'ui-developer.app-manager.sources.heading.repo' }),
            tokenStart: intl.formatMessage({ id: 'ui-developer.app-manager.sources.heading.tokenStart' }),
            tokenEnd: intl.formatMessage({ id: 'ui-developer.app-manager.sources.heading.tokenEnd' }),
          }}
          id="app-sources"
          sortby="owner,repo"
          hiddenFields={['lastUpdated', 'numberOfObjects']}
          clientGeneratePk=""
        />
      </Paneset>
    );
  }
}

export default injectIntl(withStripes(Sources));
