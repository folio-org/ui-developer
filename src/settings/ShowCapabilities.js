import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { Button, Pane, Row, Col, TextField } from '@folio/stripes/components';

const ShowCapabilities = () => {
  const ky = useOkapiKy();
  const [capabilitiesResults, setCapabilitiesResults] = useState({});
  const [capabilitySetsResults, setCapabilitySetsResults] = useState({});
  const [query, setQuery] = useState('');

  const submit = async () => {

    const capabilitiesResults = await ky.get(`capabilities?limit=1000&offset=0&query=name=*${query}*`).json();
    setCapabilitiesResults(capabilitiesResults);

    const capabilitySetsResults = await ky.get(`capability-sets?limit=1000&offset=0&query=name=*${query}*`).json();
    setCapabilitySetsResults(capabilitySetsResults);

  };

  const displayList = (resultList, listType) => {
    return resultList[listType]?.map((value) => {
      return (
        <ul>
          <li>{value.permission}</li>
          <ul>
            <li><strong>type:</strong> {value.type}</li>
            <li><strong>applicationId:</strong> {value.applicationId}</li>
            <li><strong>resource:</strong> {value.resource}</li>
            <li><strong>action:</strong> {value.action}</li>
            <li><strong>permissionName:</strong> {value.name}</li>
            {/* <li><strong>permissionDisplayName:</strong>TRANSLATE{value.name}</li> */}
          </ul>
        </ul>
      )
    }
  )
  }

  return (
    <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-developer.capabilities" />}
      >
        <Row>
          <Col xs={12}>
            <TextField label={<FormattedMessage id="ui-developer.okapiQuery.queryPath" />} name="query" fullWidth id="query" value={query} onInput={e => setQuery(e.target.value)} />
            {/* <Select
                id="searchBy"
                name="searchBy"
                label={<FormattedMessage id="ui-developer.okapiConfigurationEntries.filterByModule" />}
                dataOptions={['permission displayName', 'permission name']}
              /> */}
            <div><Button onClick={submit}><FormattedMessage id="ui-developer.capabilitiesTitle" /></Button></div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            { capabilitiesResults.capabilities?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
            {
              displayList(capabilitiesResults, 'capabilities')
            }
            { capabilitySetsResults.capabilitySets?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilitySets" /></h3> }
            {
              displayList(capabilitySetsResults, 'capabilitySets')
            }
          </Col>
        </Row>
      </Pane>
    );
};

export default stripesConnect(ShowCapabilities);