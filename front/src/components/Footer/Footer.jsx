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

function Footer({
  swapCardName, swapExplorerName
}) {
  const location = useLocation();
  const hiddenPaths = ['/menu', '/login', '/register', '/register/user']; 

  // Managing back button
  let btnClassName;
  if (hiddenPaths.includes(location.pathname)) {
    btnClassName = "d-none";
  } else {
    btnClassName = "back-button position-absolute top-5 start-5";
  }

  // Managing page Title
  let pageTitle;
  switch (location.pathname) {
    case '/login':
      pageTitle = 'Login';
      break;
    case '/register':
     pageTitle = 'Sign up';
     break;
    case '/report':
      pageTitle = 'Report my cards';
      break;
    case '/swap':
      pageTitle = 'Swap my cards';
      break;
    case '/swap/card':
      pageTitle = 'Find a swap';
      break;
    case '/swap/card/chat':
      if (!swapCardName || !swapExplorerName) {
        pageTitle = 'Find a swap';
      } else {
      pageTitle = `${swapCardName} - ${swapExplorerName}`;
      }
      break;
    case '/swap/opportunities':
     pageTitle = 'My opportunities';
     break;
    case '/swap/requests':
     pageTitle = 'My swap requests';
     break;
    case '/check':
      pageTitle = 'My cards';
      break;
    default:
      pageTitle = 'WeSwapCards';
      break;
  }

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
