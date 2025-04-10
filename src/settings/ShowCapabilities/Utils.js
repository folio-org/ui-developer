import React from "react";

export const APPLICATIONS_STEP_SIZE = 100;

const lookUpPermissionDisplayNameById = (permissionName) => {
  return stripes.discovery?.permissionDisplayNames?.[permissionName];
};

export const displayList = (resultList, listType) => {
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
