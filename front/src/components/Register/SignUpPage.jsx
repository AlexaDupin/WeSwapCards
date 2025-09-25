import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { SignUp } from '@clerk/clerk-react'; 

import './registerStyles.scss';

function SignUpPage() {

  return (
    <PageContainer>
      <div className="signup-container mt-4">
        <SignUp 
          routing="virtual"
          forceRedirectUrl="/register/user"
        />
      </div>
    </PageContainer>
  )
}

export default React.memo(SignUpPage);
