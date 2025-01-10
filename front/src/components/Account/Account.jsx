import React from 'react';
import {
  NavLink, useNavigate, Link, useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container, Table
} from "react-bootstrap";

import './accountStyles.scss';

function Account({
    user, name, token
}) {
    const email = user.email;
    console.log(email);

  return (
    <Container className="page-container">
    <h1 className="page-title">My information</h1>

    <table>
      <tbody>
        <tr>
          <td className="account-title">Email:</td>
          <td className="account-item">{email}</td>
        </tr>
        <tr>
          <td className="account-title">Username:</td>
          <td className="account-item">{name}</td>
        </tr>
      </tbody>
    </table>

    <div className='disclaimer'>
        <p>If you want to change your username or delete your account, please send an email to weswapcards@gmail.com.</p>
        <p>Note that you cannot change your email address.</p>
    </div>

    </Container>
  );
}

Account.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Account);
