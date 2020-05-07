import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HotKeys, Pane } from '@folio/stripes/components';
import { withStripes } from '@folio/stripes/core';

function TestHotkeys(props) {
  const handlers = {
    stripesHome: () => {
      props.stripes.logger.log('action', 'handler for stripesHome: going to /');
      props.history.push('/');
    },
    stripesAbout: () => {
      props.stripes.logger.log('action', 'handler for stripesAbout: going to /about');
      props.history.push('/about');
    },
  };

  const bindings = props.stripes.bindings || {};
  return (
    <HotKeys handlers={handlers} noWrapper>
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={props.label}>
        <p>
          <FormattedMessage id="ui-developer.hotkeys.instructions" />
        </p>
        <ul>
          <li>
            <tt>
              {bindings.stripesHome || <FormattedMessage id="ui-developer.hotkeys.undefined" />}
            </tt>
            {' '}
            <FormattedMessage id="ui-developer.hotkeys.home" />
          </li>
          <li>
            <tt>
              {bindings.stripesAbout || <FormattedMessage id="ui-developer.hotkeys.undefined" />}
            </tt>
            {' '}
            <FormattedMessage id="ui-developer.hotkeys.about" />
          </li>
        </ul>
      </Pane>
    </HotKeys>
  );
}

TestHotkeys.propTypes = {
  label: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    bindings: PropTypes.shape({
      stripesAbout: PropTypes.string,
      stripesHome: PropTypes.string,
    }),
    logger: PropTypes.shape({
      log: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withStripes(TestHotkeys);
