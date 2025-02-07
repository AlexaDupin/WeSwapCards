import React from 'react';
import { SignUp } from '@clerk/clerk-react'; 

import {
  Container,
} from "react-bootstrap";

import './registerStyles.scss';

function SignUpPage() {

  return (
    <Container className="page-container">
      <h1 className="page-title">Sign Up</h1>
      <div className="signup-container">
        <SignUp 
          routing="virtual"
          // routing="path" 
          forceRedirectUrl="/register/user"
        />
      </div>
    </Container>
)
}

export default React.memo(SignUpPage);
