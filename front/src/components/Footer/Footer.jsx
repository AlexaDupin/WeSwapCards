import React from 'react';
import {
  NavLink
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

  return (
    <footer className="footer text-center border-top fixed-bottom">
        <NavLink to="/swap/card" className="footer-link">
            <Search />
            <p className="footer-caption">Find a card</p>
        </NavLink>
        <NavLink to="/swap/requests" className="footer-link">
            <CardList />
            <p className="footer-caption">Dashboard</p>
        </NavLink>
        <NavLink to="/report" className="footer-link">
            <Pencil />
            <p className="footer-caption">Report</p>
        </NavLink>
        <NavLink to="/check" className="footer-link">
            <Eyeglasses />
            <p className="footer-caption">My cards</p>
        </NavLink>
    </footer>     
  );
}

Footer.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Footer);
