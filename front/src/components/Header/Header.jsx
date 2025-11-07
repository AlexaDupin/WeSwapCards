import React, { useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import useStickyVars from "../../hooks/useStickyVars";
import "./headerStyles.scss";

function Header() {
  const appHeaderRef = useRef(null);
  useStickyVars({ ref: appHeaderRef, cssVarName: "--header-h", dimension: "height" });

  useEffect(() => {
    const el = appHeaderRef.current;
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 4) el.classList.add("is-elevated");
      else el.classList.remove("is-elevated");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const location = useLocation();
  const from = `${location.pathname}${location.search}${location.hash || ""}`;

  const links = [
    { to: "/swap/card",      label: "Swap" },
    { to: "/swap/dashboard", label: "Messages" },
    { to: "/cards",          label: "My cards" },
  ];

  const navLinkClass = ({ isActive }) =>
    `header-nav-link header-nav-item${isActive ? " header-nav-link--active" : ""}`;

  return (
    <header ref={appHeaderRef} className="header fixed-top">
      <div className="header-inner container-fluid">
        <NavLink
          to="/"
          className="header-brand"
          aria-label="WeSwapCards home"
          style={{ textDecoration: "none" }}
        >
          <h1 className="header-title m-0">WeSwapCards</h1>
        </NavLink>

        <nav className="header-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <SignedIn>
            <UserButton />
          </SignedIn>
          
          <SignedOut>
            <NavLink
                to={{ pathname: "/login", search: `?from=${encodeURIComponent(from)}` }}
                className="header-login-link"
            >
              Sign in
            </NavLink>
          </SignedOut>
        </div>

      </div>
    </header>
  );
}

export default Header;
