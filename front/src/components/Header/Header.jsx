import React from 'react';
import {
  NavLink, useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';

import './headerStyles.scss';

function Header() {
  const location = useLocation();
  const hiddenPaths = ['/menu', '/login', '/register', '/register/user']; 

  // Managing back button
  let btnClassName;
  if (hiddenPaths.includes(location.pathname)) {
    btnClassName = "d-none";
  } else {
    btnClassName = "back-button position-absolute top-5 start-5";
  }

  // Managing page Title
  let pageTitle;
  switch (location.pathname) {
    case '/login':
      pageTitle = 'Login';
      break;
    case '/register':
     pageTitle = 'Sign up';
     break;
    case '/report':
      pageTitle = 'Report my cards';
      break;
    case '/opportunities':
     pageTitle = 'My opportunities';
     break;
    case '/check':
      pageTitle = 'My cards';
      break;
    default:
      pageTitle = 'WeSwapCards';
      break;
  }

  return (
    <header className="header text-center container p-3 border-bottom fixed-top">
        <div 
          className={btnClassName}
        >
                  <NavLink to="/menu">
                  <i className="header-icon bi bi-chevron-left"></i>
                  </NavLink>
        </div>
        <div>
            <h1 className="header-title m-0">{pageTitle}</h1>
        </div>
    </header>     
  );
}

Header.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Header);
