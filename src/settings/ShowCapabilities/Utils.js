import React from 'react';

import { useStripes } from '@folio/stripes/core';

export const APPLICATIONS_STEP_SIZE = 100;

const stripes = useStripes();

const lookUpPermissionDisplayNameById = (permissionName) => {
  return stripes.discovery?.permissionDisplayNames?.[permissionName];
};

export const displayList = (resultList) => {
  return resultList?.map((resultItem) => (
    <ul key={resultItem.name}>
      <li>{resultItem.name}</li>
      <ul>
        <li><strong>type:</strong> {resultItem.type}</li>
        <li><strong>applicationId:</strong> {resultItem.applicationId}</li>
        <li><strong>resource:</strong> {resultItem.resource}</li>
        <li><strong>action:</strong> {resultItem.action}</li>
        <li><strong>permissionName:</strong> {resultItem.permission}</li>
        <li><strong>permissionDisplayName:</strong> {lookUpPermissionDisplayNameById(resultItem.permission)}</li>
      </ul>
    </ul>
  ));
};
