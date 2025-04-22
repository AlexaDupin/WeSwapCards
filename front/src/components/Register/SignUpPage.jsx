import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { SignUp } from '@clerk/clerk-react'; 

import './registerStyles.scss';

function SignUpPage() {

  return (
    <PageContainer>
      <h1 className="page-title">Sign Up</h1>
      <div className="signup-container">
        <SignUp 
          routing="virtual"
          forceRedirectUrl="/register/user"
        />
      </div>
    </PageContainer>
  )
}

export default React.memo(SignUpPage);
