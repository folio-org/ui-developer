import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, withStripes } from '@folio/stripes/core';


import {
  Pane,
  Button,
  List,
} from '@folio/stripes/components';

class OkapiPaths extends React.Component {
  static manifest = Object.freeze({
    moduleDetails: {
      type: 'okapi',
//      records: 'users',
      path: '_/proxy/modules/%{moduleId}',
      accumulate: true,
    },
    moduleId: '',
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      moduleDetails: PropTypes.object,
      moduleId: PropTypes.object,
    }).isRequired,
  };


  componentDidMount() {
    const modules = _.get(this.props.stripes, ['discovery', 'modules']) || {};
    console.log(modules);

    const getter = this.props.resources.moduleDetails;
    console.log(this.props.resources);
    Object.keys(modules).forEach(m => {
      this.setState({ [m] : {} });
      // getter.reset();
      // moduleId.replace(m)
      // getter.GET().then(details => {
      //   console.log(`module: ${m}`, details);
      // });
    });



/*
18   const uv = props.parentMutator.userUniquenessValidator;
19   const query = `(barcode="${values.requester.barcode}")`;
20
21   uv.reset();
22   return uv.GET({ params: { query } }).then((users) => {
23     return (users.length < 1)
24       ? { barcode: <FormattedMessage id="ui-requests.errors.userBarcodeDoesNotExist" /> }
25       : null;
26   });

*/
  }

  componentDidUpdate() {
    const modules = _.get(this.props.stripes, ['discovery', 'modules']) || {};

    console.log(this.props.resources);
    if (this.props.resources.moduleDetails) {
      const getter = this.props.resources.moduleDetails;
      Object.keys(modules).forEach(m => {
        getter.reset();
        moduleId.replace(m);

        getter.GET().then(details => {
          console.log(`module: ${m}`, details);
        });
      });

    }


        console.log(this.state);

  }


  render() {
    return (
      <Pane
        defaultWidth="fill"
        paneTitle="Okapi paths"
      >
        testing 123
      </Pane>
    );
  }
}

OkapiPaths.propTypes = {
  stripes: PropTypes.shape({
    setLocale: PropTypes.func,
  }).isRequired,
};

export default stripesConnect(OkapiPaths);
