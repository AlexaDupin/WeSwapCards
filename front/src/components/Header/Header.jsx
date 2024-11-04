import React, {useState} from 'react';
import {
  NavLink,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import './headerStyles.scss';

function Header({title}) {

  return (
    <header className="header text-center container p-3 border-bottom fixed-top">
        <div className="back-button position-absolute top-5 start-5">
                  <NavLink to="/menu">
                  <i className="header-icon bi bi-chevron-left"></i>
                  </NavLink>
        </div>
        <div>
            <h1 className="header-title m-0">{title}</h1>
        </div>
    </header>     
  );
}

Header.propTypes = {
    title: PropTypes.string,
};

Header.defaultProps = {
    title: 'WeSwapCards',
  };

export default React.memo(Header);
