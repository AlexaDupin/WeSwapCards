import React from 'react';
import {
  Link, useNavigate
} from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavDropdown
} from "react-bootstrap";
import PropTypes from 'prop-types';

import './navBarStyles.scss';
import supabase from '../../helpers/Supabase';

function NavBar({
    setName, setIsLogged
}) {
  const navigate = useNavigate();

  const handleSignOut = async() => {
    console.log("SUPA SIGNOUT");

    try {
      const {error} = await supabase.auth.signOut();
      console.log("SIGNOUT response", {error});
      localStorage.clear();
      setName('');
      setIsLogged(false);
      navigate('/login');

    } catch (error) {
      console.error("Error during sign out:", error);
    }
    
  }

  return (
    <Navbar className="navbar" expand="md" sticky="top" style={{margin: 0}}>
      {/* <Container  style={{margin: 0}}> */}
        {/* <Navbar.Collapse id="justify-content-center" style={{width: '100%'}}> */}
          <Nav className="me-auto">
            <NavDropdown title="Swap" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/swap/card">Find a card</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/swap/requests">
                Check all requests
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/swap/opportunities">All opportunities</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="My cards" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/report">Report my cards</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/check">
                Check all my cards
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/swap/card">My account</NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignOut}>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        {/* </Navbar.Collapse> */}
      {/* </Container> */}
    </Navbar>
  );
}

NavBar.propTypes = {
    title: PropTypes.string,
};

export default React.memo(NavBar);
