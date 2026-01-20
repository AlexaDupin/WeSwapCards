import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useUser();  
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '/';

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      navigate(`/login/redirect?from=${encodeURIComponent(from)}`, { replace: true });
    } else {
      try { localStorage.clear(); } catch {}
    }
  }, [isLoaded, isSignedIn, from, navigate]);

  return (
    <PageContainer>
      <div className="signup-container mt-4">
        <SignIn forceRedirectUrl={`/login/redirect?from=${encodeURIComponent(from)}`} />
      </div>
    </PageContainer>
  )
}

export default React.memo(SignInPage);
