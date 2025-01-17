import React from 'react';
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

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
        <nav 
          className="header-nav"
          id="header-nav-login"
        >
        <UserButton />
        </nav>
    </header>     
  );
}

Header.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Header);
