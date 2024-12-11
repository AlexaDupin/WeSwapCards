import React from 'react';
import {
  NavLink, useLocation, useNavigate
} from 'react-router-dom';
import {
  NavDropdown
} from "react-bootstrap";
import {
  PersonCircle
} from "react-bootstrap-icons";
import PropTypes from 'prop-types';
import axios from 'axios';

import './headerStyles.scss';

function Header({
  swapCardName, swapExplorerName,
}) {
  const location = useLocation();
  const hiddenPaths = ['/menu', '/login', '/register', '/register/user']; 
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

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
    case '/swap':
      pageTitle = 'Swap my cards';
      break;
    case '/swap/card':
      pageTitle = 'Find a swap';
      break;
    case '/swap/card/chat':
      if (!swapCardName || !swapExplorerName) {
        pageTitle = 'Find a swap';
      } else {
      pageTitle = `${swapCardName} - ${swapExplorerName}`;
      }
      break;
    case '/swap/opportunities':
     pageTitle = 'My opportunities';
     break;
    case '/swap/requests':
     pageTitle = 'My swap requests';
     break;
    case '/check':
      pageTitle = 'My cards';
      break;
    default:
      pageTitle = 'WeSwapCards';
      break;
  }

  const handleSignOut = () => {
    localStorage.clear();
    axios.get(`${baseUrl}/signout`);
    navigate('/login');    
  }

  return (
    <header className="header text-center border-bottom fixed-top">
        <div 
          className={btnClassName}
        >
                {location.pathname === "/swap/card" || location.pathname === "/swap/card/chat" || location.pathname === "/swap/requests" || location.pathname === "/swap/opportunities" ? 
                  <NavLink to="/swap">
                  <i className="header-icon bi bi-chevron-left"></i>
                  </NavLink>
                : <NavLink to="/menu">
                  <i className="header-icon bi bi-chevron-left"></i>
                  </NavLink>
                }
        </div>
        <div>
          {location.pathname === "/register/user" ? 
            <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">{pageTitle}</h1>
            </NavLink>
            : <h1 className="header-title m-0">{pageTitle}</h1>
          }
        </div>
        {/* <div className="header-profile">
          {token ? 
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <PersonCircle className="header-profile" />
            </NavLink>
            : <div></div>
          }
        </div> */}
          {location.pathname === "/register/user" || location.pathname === "/register" || location.pathname === "/login" ? 
          <div style={{ textDecoration: 'none' }}>
          </div>
            : 
            <div  className="header-profile">
            <PersonCircle className="header-profile" />
              <NavDropdown title="" className="header-dropdown">
                <NavDropdown.Item 
                  href="#action/3.1" 
                  onClick={handleSignOut}
                >Sign out</NavDropdown.Item>
              </NavDropdown>  
          </div>
          }

    </header>     
  );
}

Header.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Header);
