import React, { useRef } from 'react';
// import { UserButton, useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import {
  NavLink, Link, useNavigate
} from 'react-router-dom';
import {
  NavDropdown, Button
} from "react-bootstrap";

import './headerStyles.scss';
import useStickyVars from '../../hooks/useStickyVars';

function Header() {
  // const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const appHeaderRef = useRef(null);
  useStickyVars({ ref: appHeaderRef, cssVarName: "--header-h", dimension: "height" });

  return (
    <header ref={appHeaderRef} className="header border-bottom fixed-top">
        
        <SignedIn>
        <div>
          <NavLink to="/menu" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
          </NavLink>
        </div>
        <nav className="header-nav" id="header-nav-login">
          <NavDropdown title="Swap" id="basic-nav-dropdown" className="header-nav-item">
            <NavDropdown.Item as={Link} to="/swap/card">Find a card</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/swap/dashboard">Check all requests</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown.Item
            title="My cards"
            id="basic-nav-dropdown"
            className="header-nav-item mr-3"
            as={Link}
            to="/cards"
          >
            My cards
          </NavDropdown.Item>
          <UserButton afterSignOutUrl="/login" />
        </nav>
      </SignedIn>

      <SignedOut>
        <div style={{ margin: 0 }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
          </NavLink>
        </div>
        <nav className="header-nav header-nav-login">
          <Button variant="light" className="header-nav-login" onClick={() => navigate('/login')}>
            Sign in
          </Button>
        </nav>
      </SignedOut>

        {/* {isSignedIn ?
        <div>
          <NavLink to="/menu" style={{ textDecoration: 'none' }}>
            <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
          </NavLink>
        </div>
        :
        <div style={{ margin: 0 }}>
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
          </NavDropdown>
          <NavDropdown.Item title="My cards" id="basic-nav-dropdown" className="header-nav-item mr-3" as={Link} to="/cards">
            My cards
          </NavDropdown.Item>
          <UserButton 
            afterSignOutUrl="/login" 
          />
        </nav>
        : 
        <nav 
          className="header-nav header-nav-login"
        >
          <Button variant="light" className="header-nav-login" onClick={() => navigate('/login')}>Sign in</Button>
        </nav> 
      } */}

    </header> 

  );
}

export default React.memo(Header);
