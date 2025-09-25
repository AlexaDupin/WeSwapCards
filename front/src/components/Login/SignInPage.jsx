import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { SignIn, useUser } from '@clerk/clerk-react';

const SignInPage = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.clear();
    }
  }, [isSignedIn]);

  return (
  <PageContainer>
    <div className="signup-container mt-4">
      <SignIn 
        forceRedirectUrl="/login/redirect"
      />
    </div>
  </PageContainer>
  )
}

export default React.memo(SignInPage);
