import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, useStripes } from '@folio/stripes/core';
import { Button, Checkbox, Layout, Pane, Row, Col, SearchField, Select } from '@folio/stripes/components';
import Capabilities from './Capabilities';
import CapabilitySets from './CapabilitySets';

const ShowCapabilities = () => {
  const SEARCH_BY_TYPES = {
    PERMISSION_DISPLAY_NAME: 'permissionDisplayName',
    PERMISSION_NAME: 'permissionName'
  };

  const searchByOptions = [{ label: SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME, value: SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME },
  { label: SEARCH_BY_TYPES.PERMISSION_NAME, value: SEARCH_BY_TYPES.PERMISSION_NAME }];

  const stripes = useStripes();
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchBy, setSearchBy] = useState(SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME);
  const [exactMatchOnly, setExactMatchOnly] = useState(false);

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const searchForPermissionDisplayName = (displayNameQuery, isExactMatch) => {
    const searchIds = [];

    if (stripes.discovery?.permissionDisplayNames) {
      const normalizedQuery = displayNameQuery?.toUpperCase().trim();

      for (const [key, value] of Object.entries(stripes.discovery.permissionDisplayNames)) {
        const normalizedValue = value?.toUpperCase().trim();
        const isMatch = isExactMatch ? normalizedValue === normalizedQuery : normalizedValue?.includes(normalizedQuery);

        if (isMatch) {
          searchIds.push(key);
        }
      }
    }

    return searchIds;
  };

  const submit = async () => {
    if (searchBy === SEARCH_BY_TYPES.PERMISSION_DISPLAY_NAME) {
      const searchIds = searchForPermissionDisplayName(searchText, exactMatchOnly);
      setSearchQuery(searchIds);
    } else {
      setSearchQuery([exactMatchOnly ? searchText : `*${searchText}*`]);
    }
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
          <Checkbox label="Exact match only" checked={exactMatchOnly} onChange={e => setExactMatchOnly(e.target.checked)} />
        </Col>
      </Row>
      <Layout element={Row} className="marginTop1">
        <Col xs={12}>
          <Button onClick={submit}><FormattedMessage id="ui-developer.search" /></Button>
        </Col>
      </Layout>
      <Row>
        <Col xs={12}>
          <Capabilities query={searchQuery} />
          <CapabilitySets query={searchQuery} />
        </Col>
      </Row>
    </Pane>
  );
};

export default stripesConnect(ShowCapabilities);
