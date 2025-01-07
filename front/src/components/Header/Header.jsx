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
  swapCardName, swapExplorerName, setName
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    localStorage.clear();
    setName('');
    navigate('/login');    
  }

  return (
    <header className="header text-center border-bottom fixed-top">
        <div>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
            </NavLink>
        </div>
        {location.pathname === "/" || location.pathname === "/register/user" || location.pathname === "/register" || location.pathname === "/login" ? 
        <nav></nav>
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
              <NavDropdown.Item as={Link} to="/swap/card">My account</NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignOut}>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
        </nav>
        }
        {location.pathname === "/home" || location.pathname === "/register/user" || location.pathname === "/register" || location.pathname === "/login" ? 
          <div style={{ textDecoration: 'none' }}>
          </div>
            : 
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
