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
import PrivacyPolicy from '../Legal/PrivacyPolicy/PrivacyPolicy';

function Footer() {
  const location = useLocation();

  return (
    <footer className="footer text-center ">
       <div className="footer-desktop border-top">
        <NavLink to="/privacy" className="footer-desktop-link">
            <p className="footer-desktop-caption">Privacy Policy</p>
        </NavLink>
        <NavLink to="/terms" className="footer-desktop-link">
            <p className="footer-desktop-caption">Terms and Conditions</p>
        </NavLink>
        <NavLink to="/contact" className="footer-desktop-link">
            <p className="footer-desktop-caption">Contact us</p>
        </NavLink>
      </div>

      {location.pathname === "/" || location.pathname === "/register/user" || location.pathname === "/register" || location.pathname === "/login" ?
      <div></div>
      :
      <div className="footer-mobile border-top fixed-bottom">
        <NavLink to="/swap/card" className="footer-mobile-link">
            <Search />
            <p className="footer-mobile-caption">Find a card</p>
        </NavLink>
        <NavLink to="/swap/requests" className="footer-mobile-link">
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
