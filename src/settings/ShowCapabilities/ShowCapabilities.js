import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, useChunkedCQLFetch, useOkapiKy, useStripes } from '@folio/stripes/core';
import { Button, Pane, Row, Col, SearchField, Select } from '@folio/stripes/components';
import Capabilities from './Capabilities';
import { set } from 'lodash';

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
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchBy, setSearchBy] = useState(SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME);

  const searchParams = {
    limit: stripes.config.maxUnpagedResourceCount,
    query: '',
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const searchForPermissionDisplayName = (displayNameQuery) => {
    const searchIds = [];

    if (stripes.discovery?.permissionDisplayNames) {
      for (const [key, value] of Object.entries(stripes.discovery.permissionDisplayNames)) {
        if (value?.toUpperCase().trim().includes(displayNameQuery?.toUpperCase().trim())) {
          searchIds.push(key);
        }
      }
    }

    return searchIds;
  };

  const submit = async () => {
    if (searchBy === SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME) {
      const searchIds = searchForPermissionDisplayName(searchText);
      setSearchQuery(searchIds);
      //searchParams.query = `permission=${searchIds.join(' OR permission=')}`;
    } else {
      searchParams.query = `permission=*${searchText}*`;
    }

    // const capabilitiesResponse = await ky.get('capabilities', { searchParams }).json();
    // setCapabilitiesResults(capabilitiesResponse);

    // const capabilitySetsResponse = await ky.get('capability-sets', { searchParams }).json();
    // setCapabilitySetsResults(capabilitySetsResponse);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      submit();
    }
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
        <SearchField name="query" id="query" value={searchText} style={{ width: '50vw' }} onInput={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown} />
        &nbsp;&nbsp;
        <Button onClick={submit}><FormattedMessage id="ui-developer.search" /></Button>
      </Row>
      <Row>
        <Select
          name="searchBy"
          label={<FormattedMessage id="ui-developer.searchBy" />}
          dataOptions={searchByOptions}
          onChange={handleSearchByChange}
        />
      </Row>
      <Row>
        <Col xs={12}>
          <Capabilities query={searchQuery} />
          {/* { capabilitiesResults.capabilities?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilities" /></h3> }
          { displayList(capabilitiesResults, 'capabilities') }
          { capabilitySetsResults.capabilitySets?.length > 0 && <h3><FormattedMessage id="ui-developer.capabilitySets" /></h3> }
          { displayList(capabilitySetsResults, 'capabilitySets') } */}
        </Col>
      </Row>
    </Pane>
  );
};

export default stripesConnect(ShowCapabilities);
