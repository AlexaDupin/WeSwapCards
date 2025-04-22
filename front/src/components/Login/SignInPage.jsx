import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { SignIn, useUser } from '@clerk/clerk-react';

import './loginStyles.scss';

const SignInPage = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.clear();
    }
  }, [isSignedIn]);

  return (
  <PageContainer>
    <h1 className="page-title">Sign in</h1>
    <div className="signup-container">
      <SignIn 
        forceRedirectUrl="/login/redirect"
      />
    </div>
  </PageContainer>
  )
}

export default React.memo(SignInPage);
