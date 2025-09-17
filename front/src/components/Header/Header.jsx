import React, { useLayoutEffect, useRef } from 'react';
import { UserButton, useUser } from "@clerk/clerk-react";

import {
  NavLink, Link, useNavigate
} from 'react-router-dom';
import {
  NavDropdown, Button
} from "react-bootstrap";

import './headerStyles.scss';

function Header() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);

    setVar();                                 // set on mount
    const ro = new ResizeObserver(setVar);    // update on size changes (breakpoints, auth state, fonts)
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <header className="header border-bottom fixed-top">
        
        {isSignedIn ?
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
              {/* <NavDropdown.Item as={Link} to="/swap/opportunities">All opportunities</NavDropdown.Item> */}
            </NavDropdown>
            <NavDropdown title="My cards" id="basic-nav-dropdown" className="header-nav-item mr-3">
              <NavDropdown.Item as={Link} to="/report">Report my cards</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cards">
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
          <Button variant="light" className="header-nav-login" onClick={() => navigate('/login')}>Sign in</Button>
        </nav> 
      }

    </header> 

  );
}

export default React.memo(Header);
