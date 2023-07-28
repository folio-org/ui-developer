import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';
import { ObjectInspector } from 'react-inspector';

const StripesInspector = ({ stripes }) => {
  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.stripesInspector" />}
    >
      <ObjectInspector
        data={stripes}
        expandLevel={1}
        sortObjectKeys
      />
    </Pane>
  );
};

StripesInspector.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default StripesInspector;
