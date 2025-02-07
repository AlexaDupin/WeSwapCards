import React from 'react';
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";

import {
  NavLink, Link, useNavigate
} from 'react-router-dom';
import {
  NavDropdown
} from "react-bootstrap";

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
            <UserButton 
              afterSignOutUrl="/login" 
            />
        </nav>
        : 
        <nav 
          className="header-nav"
          id="header-nav-login"
          onClick={() => navigate('/login')}
        >
          Sign in
        </nav> 
      }

    </header> 

  );
}

export default React.memo(Header);
