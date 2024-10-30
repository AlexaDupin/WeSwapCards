import React from 'react';
import {
  NavLink,
} from 'react-router-dom';
// import PropTypes from 'prop-types';

import './headerStyles.scss';

function Header() {

  return (
    <header className="header text-center container p-3 border-bottom fixed-top">
        <div className="back-button position-absolute top-5 start-5">
                  <NavLink to="/menu">
                  <i className="header-icon bi bi-chevron-left"></i>
                  </NavLink>
        </div>
        <div>
            <h1 className="header-title m-0">WeSwapCards</h1>
        </div>
        {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
        </script> */}
    </header>     
  );
}

Header.propTypes = {

};

export default React.memo(Header);
