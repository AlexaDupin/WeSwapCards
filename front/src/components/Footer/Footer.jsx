import React from 'react';
import {
  NavLink
} from 'react-router-dom';
import { Search, ListCheck, ChatDots } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { useUser } from '@clerk/clerk-react';

import './footerStyles.scss';
function Footer() {
  const { isLoaded, isSignedIn } = useUser();

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
          <a href="/cookies" target="_blank" className="footer-desktop-link" rel="noopener noreferrer">
                <p className="footer-desktop-caption">Cookie Policy</p>
          </a>
          <a href="/contact" target="_blank" className="footer-desktop-link" rel="noopener noreferrer">
                <p className="footer-desktop-caption">Contact us</p>
          </a>
      </div>

      
      {/* For mobile screens */}
      {isLoaded && isSignedIn && (
      <div className="footer-mobile border-top fixed-bottom">
        <NavLink 
          to="/swap/card" 
          className={({ isActive }) =>
            `footer-mobile-link${isActive ? ' footer-mobile-link--active' : ''}`
        }>
          <Search />
          <p className="footer-mobile-caption">Swap</p>
        </NavLink>
        <NavLink 
          to="/swap/dashboard" 
          className={({ isActive }) =>
          `footer-mobile-link${isActive ? ' footer-mobile-link--active' : ''}`
          }
        >            
          <ChatDots />
          <p className="footer-mobile-caption">Messages</p>
        </NavLink>
        <NavLink 
          to="/cards" 
          className={({ isActive }) =>
          `footer-mobile-link${isActive ? ' footer-mobile-link--active' : ''}`
          }
        >
          <ListCheck />
          <p className="footer-mobile-caption">My cards</p>
        </NavLink>
      </div>
    )}    
    </footer>     
  );
}

Footer.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Footer);
