import React from 'react';
import { UserButton } from "@clerk/clerk-react";

import {
  NavLink, Link, 
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  NavDropdown
} from "react-bootstrap";

import './headerStyles.scss';

function Header({
  setName, setIsLogged
}) {

  return (
    <header className="header border-bottom fixed-top">
        
        <div>
          <NavLink to="/menu" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
          </NavLink>
        </div>
        <nav 
          className="header-nav"
          id="header-nav-login"
        >
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
            <UserButton />
        </nav>

    </header> 

  );
}

Header.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Header);
