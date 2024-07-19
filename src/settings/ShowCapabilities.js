import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { Button, Pane, Row, Col, SearchField, Select } from '@folio/stripes/components';

const ShowCapabilities = () => {
  const SEARCH_BY_TYPES = {
    PERMISSION_DISPLAY_NAME: 'permissionDisplayName',
    PERMISSION_NAME: 'permissionName'
  };

  const searchByOptions = [{ label: SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME, value: SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME },
    { label: SEARCH_BY_TYPES.PERMISSION_NAME, value: SEARCH_BY_TYPES.PERMISSION_NAME }];

  const ky = useOkapiKy();
  const stripes = useStripes();
  const [capabilitiesResults, setCapabilitiesResults] = useState({});
  const [capabilitySetsResults, setCapabilitySetsResults] = useState({});
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState(SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME);

  const searchParams = {
    limit: stripes.config.maxUnpagedResourceCount,
    query: '',
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const submit = async () => {
    if (searchBy === SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME) {
      const searchIds = searchForPermissionDisplayName(query);
      searchParams.query = `permission=${searchIds.join(' OR permission=')}`;
    } else {
      searchParams.query = `permission=*${query}*`;
    }

    const capabilitiesResponse = await ky.get('capabilities', { searchParams }).json();
    setCapabilitiesResults(capabilitiesResponse);

    const capabilitySetsResponse = await ky.get('capability-sets', { searchParams }).json();
    setCapabilitySetsResults(capabilitySetsResponse);
  };

  const searchForPermissionDisplayName = (displayNameQuery) => {
    let searchIds = [];

    if (stripes.discovery?.permissionDisplayNames) {
      for (const [key, value] of Object.entries(stripes.discovery.permissionDisplayNames)) {
        if (value?.toUpperCase().trim().includes(displayNameQuery?.toUpperCase().trim())) {
          searchIds.push(key);
        }
      }
    }
    
    return searchIds;
  };

  const lookUpPermissionDisplayNameById = (permissionName) => {
    return stripes.discovery?.permissionDisplayNames?.[permissionName];
  };

  const displayList = (resultList, listType) => {
    return resultList[listType]?.map((value) => (
      <ul>
        <li>{value.name}</li>
        <ul>
          <li><strong>type:</strong> {value.type}</li>
          <li><strong>applicationId:</strong> {value.applicationId}</li>
          <li><strong>resource:</strong> {value.resource}</li>
          <li><strong>action:</strong> {value.action}</li>
          <li><strong>permissionName:</strong> {value.permission}</li>
          <li><strong>permissionDisplayName:</strong> {lookUpPermissionDisplayNameById(value.permission)}</li>
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
        <h3><FormattedMessage id="ui-developer.capabilitiesSubtitle" /></h3>
      </Row>
      <Row>
        <SearchField name="query" id="query" value={query} onInput={e => setQuery(e.target.value)} />
        &nbsp;&nbsp;
        <Button onClick={submit}><FormattedMessage id="ui-developer.search" /></Button>
      </Row>
      <Row>
        <Select
          name="searchBy"
          label={<FormattedMessage id="ui-developer.okapiConfigurationEntries.filterByModule" />}
          dataOptions={searchByOptions}
          onChange={handleSearchByChange}
        />
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
