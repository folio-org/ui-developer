import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { Button, Pane, Row, Col, SearchField } from '@folio/stripes/components';

const ShowCapabilities = () => {
  const ky = useOkapiKy();
  const [capabilitiesResults, setCapabilitiesResults] = useState({});
  const [capabilitySetsResults, setCapabilitySetsResults] = useState({});
  const [query, setQuery] = useState('');

  const searchParams = {
    limit: 1000,
    offset: 0,
    query: `name=*${query}*`,
  };

  const submit = async () => {
    const capabilitiesResponse = await ky.get('capabilities', { searchParams }).json();
    setCapabilitiesResults(capabilitiesResponse);

    const capabilitySetsResponse = await ky.get('capability-sets', { searchParams }).json();
    setCapabilitySetsResults(capabilitySetsResponse);
  };

  const displayList = (resultList, listType) => {
    return resultList[listType]?.map((value) => (
      <ul>
        <li>{value.permission}</li>
        <ul>
          <li><strong>type:</strong> {value.type}</li>
          <li><strong>applicationId:</strong> {value.applicationId}</li>
          <li><strong>resource:</strong> {value.resource}</li>
          <li><strong>action:</strong> {value.action}</li>
          <li><strong>permissionName:</strong> {value.name}</li>
          <li><strong>permissionDisplayName:</strong> {value.description}</li>
        </ul>
      </ul>
    ));
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.capabilities" />}
    >
      <Row>
        <Col xs={12}>
          <h3><FormattedMessage id="ui-developer.capabilitiesSubtitle" /></h3>
          <SearchField name="query" id="query" value={query} onInput={e => setQuery(e.target.value)} />
          <Button onClick={submit}><FormattedMessage id="ui-developer.search" /></Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          { capabilitiesResults.capabilities?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
          { displayList(capabilitiesResults, 'capabilities') }
          { capabilitySetsResults.capabilitySets?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilitySets" /></h3> }
          { displayList(capabilitySetsResults, 'capabilitySets') }
        </Col>
      </Row>
    </Pane>
  );
};

export default stripesConnect(ShowCapabilities);
