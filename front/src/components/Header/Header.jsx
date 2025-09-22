import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import useStickyVars from "../../hooks/useStickyVars";
import "./headerStyles.scss";

function Header() {
  const { isSignedIn } = useUser();
  const appHeaderRef = useRef(null);
  useStickyVars({ ref: appHeaderRef, cssVarName: "--header-h", dimension: "height" });

  // EXACT links you requested
  const links = [
    { to: "/swap/card",      label: "Swap" },
    { to: "/cards",          label: "My cards" },
    { to: "/swap/dashboard", label: "Dashboard" },
  ];

  const navLinkClass = ({ isActive }) =>
    `header-nav-link header-nav-item${isActive ? " header-nav-link--active" : ""}`;

  return (
    <header ref={appHeaderRef} className="header fixed-top">
      <div className="header-inner container-fluid">
        {/* Brand / title (stays in primary color) */}
        <NavLink
          to={isSignedIn ? "/menu" : "/"}
          className="header-brand"
          aria-label="WeSwapCards home"
          style={{ textDecoration: "none" }}
        >
          <h1 className="header-title m-0">WeSwapCards</h1>
        </NavLink>

        {/* Primary nav (hidden on mobile; footer handles mobile nav) */}
        <nav className="header-nav" aria-label="Primary">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions (login / user) */}
        <div className="header-actions">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <NavLink to="/login/redirect" className="btn btn-light header-nav-login">
              Log in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;



// import React, { useRef } from 'react';
// import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

// import {
//   NavLink, Link, useNavigate
// } from 'react-router-dom';
// import {
//   NavDropdown, Button
// } from "react-bootstrap";

// import './headerStyles.scss';
// import useStickyVars from '../../hooks/useStickyVars';

// function Header() {
//   const navigate = useNavigate();

//   const appHeaderRef = useRef(null);
//   useStickyVars({ ref: appHeaderRef, cssVarName: "--header-h", dimension: "height" });

//   return (
//     <header ref={appHeaderRef} className="header border-bottom fixed-top">
        
//         <SignedIn>
//         <div>
//           <NavLink to="/menu" style={{ textDecoration: 'none' }}>
//             <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
//           </NavLink>
//         </div>
//         <nav className="header-nav" id="header-nav-login">
//           <NavDropdown title="Swap" id="basic-nav-dropdown" className="header-nav-item">
//             <NavDropdown.Item as={Link} to="/swap/card">Find a card</NavDropdown.Item>
//             <NavDropdown.Item as={Link} to="/swap/dashboard">Check all requests</NavDropdown.Item>
//           </NavDropdown>
//           <NavDropdown.Item
//             title="My cards"
//             id="basic-nav-dropdown"
//             className="header-nav-item mr-3"
//             as={Link}
//             to="/cards"
//           >
//             My cards
//           </NavDropdown.Item>
//           <UserButton afterSignOutUrl="/login" />
//         </nav>
//       </SignedIn>

//       <SignedOut>
//         <div style={{ margin: 0 }}>
//           <NavLink to="/" style={{ textDecoration: 'none' }}>
//             <h1 className="header-title m-0 header-title-link">WeSwapCards</h1>
//           </NavLink>
//         </div>
//         <nav className="header-nav header-nav-login">
//           <Button variant="light" className="header-nav-login" onClick={() => navigate('/login')}>
//             Sign in
//           </Button>
//         </nav>
//       </SignedOut>

//     </header> 

//   );
// }

// export default React.memo(Header);
