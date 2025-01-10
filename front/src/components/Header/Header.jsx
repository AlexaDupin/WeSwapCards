import React from 'react';
import {
  NavLink, useNavigate, Link, useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  NavDropdown
} from "react-bootstrap";
import {
  PersonCircle
} from "react-bootstrap-icons";

import supabase from '../../helpers/Supabase';

import './headerStyles.scss';

function Header({
  setName, setIsLogged
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    console.log("SIGN OUT");
    setName('');
    setIsLogged(false);
    const { error } = await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');    
  }

  return (
    <header className="header border-bottom fixed-top">
        <div>
            <NavLink to="/menu" style={{ textDecoration: 'none' }}>
              <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
            </NavLink>
        </div>

        {location.pathname === "/" || location.pathname === "/register/user" || location.pathname === "/register" ? 
        <nav 
          className="header-nav"
          id="header-nav-login"
          onClick={() => navigate('/login')}
        >
          Login
        </nav> 
        :

        location.pathname === "/login" ? 
        <nav>     
        </nav>
        :

        <nav className="header-nav">
            <NavDropdown title="Swap" id="basic-nav-dropdown" className="header-nav-item">
              <NavDropdown.Item as={Link} to="/swap/card">Find a card</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/swap/requests">
                Check all requests
              </NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/swap/opportunities">All opportunities</NavDropdown.Item> */}
            </NavDropdown>
            <NavDropdown title="My cards" id="basic-nav-dropdown" className="header-nav-item">
              <NavDropdown.Item as={Link} to="/report">Report my cards</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/check">
                Check all my cards
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Profile" id="basic-nav-dropdown" className="header-nav-item">
              <NavDropdown.Item as={Link} to="/account">My account</NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignOut}>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
        </nav>
        }
        
        {/* For mobile screens */}

        {location.pathname === "/" || location.pathname === "/register/user" || location.pathname === "/register" ? 
          <div className="header-profile" style={{ textDecoration: 'none' }}>
            <PersonCircle className="header-profile" />
              <NavDropdown title="" className="header-dropdown">
                <NavDropdown.Item 
                  onClick={handleSignOut}
                >Login
                </NavDropdown.Item>
              </NavDropdown>            </div>
            :

        location.pathname === "/login" ?
        <div className="header-profile" style={{ textDecoration: 'none' }}>
        </div> :

            <div className="header-profile">
            <PersonCircle className="header-profile" />
              <NavDropdown title="" className="header-dropdown">
                <NavDropdown.Item 
                  onClick={handleSignOut}
                >Sign out
                </NavDropdown.Item>
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
