import React from 'react';
import { UserButton, useUser } from "@clerk/clerk-react";

import {
  NavLink, Link, useNavigate
} from 'react-router-dom';
import {
  NavDropdown
} from "react-bootstrap";
// import Logo from '../../images/logo.png';

import './headerStyles.scss';

function Header() {
  const { isSignedIn } = useUser(); // Get user's sign-in status from Clerk
  const navigate = useNavigate();

  return (
    <header className="header border-bottom fixed-top">
        
        {isSignedIn ?
        <div>
          <NavLink to="/menu" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
            {/* <img src={Logo} alt="Website logo" className="header-logo" /> */}
          </NavLink>
        </div>
        :
        <div>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
          </NavLink>
        </div>
        }

        {isSignedIn ? 
        <nav 
          className="header-nav"
          id="header-nav-login"
        >
          <NavDropdown title="Swap" id="basic-nav-dropdown" className="header-nav-item">
              <NavDropdown.Item as={Link} to="/swap/card">Find a card</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/swap/dashboard">
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
            <UserButton 
              afterSignOutUrl="/login" 
            />
        </nav>
        : 
        <nav 
          className="header-nav header-nav-login"
        >
          <a href="/login" className="header-nav-login">Sign in</a>
        </nav> 
      }

    </header> 

  );
}

export default React.memo(Header);
