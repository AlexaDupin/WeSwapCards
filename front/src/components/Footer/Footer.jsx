import React from 'react';
import {
  NavLink, useLocation
} from 'react-router-dom';
import {
	Pencil,
	Eyeglasses,
	Search,
	CardList,
} from "react-bootstrap-icons";
import PropTypes from 'prop-types';

import './footerStyles.scss';
function Footer() {
  const location = useLocation();

  return (
    <footer className="footer text-center ">

        {/* For desktop screens */}
       <div className="footer-desktop border-top">
          <a href="/privacy" target="_blank" className="footer-desktop-link" rel="noopener noreferrer">
                <p className="footer-desktop-caption">Privacy Policy</p>
          </a>
          <a href="/terms" target="_blank" className="footer-desktop-link" rel="noopener noreferrer">
                <p className="footer-desktop-caption">Terms and Conditions</p>
          </a>
          <a href="/cookies" target="_blank" className="footer-general-link" rel="noopener noreferrer">
                <p className="footer-general-caption">Cookie Policy</p>
          </a>
          <a href="/contact" target="_blank" className="footer-desktop-link" rel="noopener noreferrer">
                <p className="footer-desktop-caption">Contact us</p>
          </a>
      </div>

      
      {/* For mobile screens */}
      {location.pathname === "/" || location.pathname === "/register/user" || location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/privacy" || location.pathname === "/cookies" || location.pathname === "/terms" || location.pathname === "/contact" ?
            <div className="footer-general border-top">
             <a href="/privacy" target="_blank" className="footer-general-link" rel="noopener noreferrer">
                <p className="footer-general-caption">Privacy</p>
             </a>
             <a href="/terms" target="_blank" className="footer-general-link" rel="noopener noreferrer">
                <p className="footer-general-caption">Terms</p>
             </a>
             <a href="/cookies" target="_blank" className="footer-general-link" rel="noopener noreferrer">
                <p className="footer-general-caption">Cookies</p>
             </a>
             <a href="/contact" target="_blank" className="footer-general-link" rel="noopener noreferrer">
                <p className="footer-general-caption">Contact</p>
             </a>
           </div>
      :
      <div className="footer-mobile border-top fixed-bottom">
        <NavLink to="/swap/card" className="footer-mobile-link">
            <Search />
            <p className="footer-mobile-caption">Find a card</p>
        </NavLink>
        <NavLink to="/swap/dashboard" className="footer-mobile-link">
            <CardList />
            <p className="footer-mobile-caption">Dashboard</p>
        </NavLink>
        <NavLink to="/report" className="footer-mobile-link">
            <Pencil />
            <p className="footer-mobile-caption">Report</p>
        </NavLink>
        <NavLink to="/check" className="footer-mobile-link">
            <Eyeglasses />
            <p className="footer-mobile-caption">My cards</p>
        </NavLink>
      </div>
      }
        
    </footer>     
  );
}

Footer.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Footer);
