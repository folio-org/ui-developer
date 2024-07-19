
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  MultiColumnList,
} from '@folio/stripes/components';

const DashboardWidget = ({ results }) => {
  const [list, setList] = useState(results);
  const [sort, setSort] = useState('');
  const [sortDir, setSortDir] = useState(1);

  const onHeaderClick = (_e, m) => {
    // set sort direction: clicking the same header twice flips its direction
    setSortDir(sort === m.name ? sortDir * -1 : 1);

    // set sort field
    setSort(m.name);

    // sort the list already
    setList(pList => {
      // click the same header twice to reverse sort
      const listCopy = [...pList];
      let dir = 0;
      listCopy.sort((a, b) => {
        const aHas = Object.hasOwn(a, m.name);
        const bHas = Object.hasOwn(b, m.name);
        if (aHas && bHas) {
          dir = a[m.name].localeCompare(b[m.name]);
        } else if (aHas) {
          dir = -1;
        } else if (bHas) {
          dir = 1;
        }

        return dir * sortDir;
      });

      return listCopy;
    });
  };

  if (list.length) {
    return (
      <MultiColumnList
        contentData={list}
        onHeaderClick={onHeaderClick}
      />
    );
  }

  return null;
};

DashboardWidget.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardWidget;
