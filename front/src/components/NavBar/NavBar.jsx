import React from 'react';
import {
  NavLink, useLocation, useNavigate
} from 'react-router-dom';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown
} from "react-bootstrap";
import {
  PersonCircle
} from "react-bootstrap-icons";
import PropTypes from 'prop-types';
import axios from 'axios';

import './navBarStyles.scss';

function NavBar({
    setName
}) {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleSignOut = () => {
    localStorage.clear();
    setName('');
    axios.get(`${baseUrl}/signout`);
    navigate('/login');    
  }

  return (
    <Navbar className="navbar" expand="md" sticky="top" style={{margin: 0}}>
      {/* <Container  style={{margin: 0}}> */}
        {/* <Navbar.Collapse id="justify-content-center" style={{width: '100%'}}> */}
          <Nav className="me-auto">
            <NavDropdown title="Swap" id="basic-nav-dropdown">
              <NavDropdown.Item href="/swap/card">Find a card</NavDropdown.Item>
              <NavDropdown.Item href="/swap/requests">
                Check all requests
              </NavDropdown.Item>
              <NavDropdown.Item href="/swap/opportunities">All opportunities</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="My cards" id="basic-nav-dropdown">
              <NavDropdown.Item href="/report">Report my cards</NavDropdown.Item>
              <NavDropdown.Item href="/check">
                Check all my cards
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item href="/swap/card">My account</NavDropdown.Item>
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
