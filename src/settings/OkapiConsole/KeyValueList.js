import React from 'react';
import PropTypes from 'prop-types';
import css from './OkapiConsole.css';


function KeyValueList({ dataList }) {
  return (
    <table className={css.keyValueTable}>
      <tbody>
        {dataList.map(([key, value], i) => (
          <tr key={i}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


KeyValueList.propTypes = {
  dataList: PropTypes.arrayOf(
    PropTypes.array.isRequired,
  ).isRequired,
};


export default KeyValueList;
