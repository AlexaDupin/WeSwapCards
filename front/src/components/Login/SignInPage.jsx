import React from 'react';
import { SignIn } from '@clerk/clerk-react';

import {
  Container,
  } from "react-bootstrap";

import './loginStyles.scss';

const SignInPage = () => {

  return (
  <Container className="page-container">
    <h1 className="page-title">Login</h1>
    <div className="signup-container">
      <SignIn 
        forceRedirectUrl="/login/redirect"
      />
    </div>
  </Container>
  )
}

export default React.memo(SignInPage);
