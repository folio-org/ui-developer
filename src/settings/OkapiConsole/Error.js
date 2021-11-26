import React from 'react';
import PropTypes from 'prop-types';
import css from './OkapiConsole.css';


function Error({ error }) {
  return (
    <div className={css.error}>
      <h4>{error.summary}</h4>
      <p>{error.detail}</p>
    </div>
  );
}


Error.propTypes = {
  error: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
  }).isRequired,
};


export default Error;
