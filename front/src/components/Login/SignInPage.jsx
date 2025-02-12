import React, { useEffect } from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';

import {
  Container,
  } from "react-bootstrap";

import './loginStyles.scss';

const SignInPage = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.clear();
    }
  }, [isSignedIn]);

  return (
  <Container className="page-container">
    <h1 className="page-title">Sign in</h1>
    <div className="signup-container">
      <SignIn 
        forceRedirectUrl="/login/redirect"
      />
    </div>
  </Container>
  )
}

export default React.memo(SignInPage);
