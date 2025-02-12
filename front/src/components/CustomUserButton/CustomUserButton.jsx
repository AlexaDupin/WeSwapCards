import React, { useEffect } from 'react';
import { useClerk, UserButton, RedirectToSignIn, SignedOut } from '@clerk/clerk-react';

const CustomUserButton = () => {
  const { signOut } = useClerk();

  // Custom sign-out handler
  const handleSignOut = () => {
    signOut();
    // Clear additional localStorage data
    localStorage.clear();
  };

  // Listen for Clerk's sign-out event
  useEffect(() => {
    const handleClerkSignOut = () => {
      // Additional logic to execute on sign-out
      localStorage.clear();
    };

    // Attach the event listener
    window.addEventListener('clerk-sign-out', handleClerkSignOut);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('clerk-sign-out', handleClerkSignOut);
    };
  }, []);

  return (
    <div>
      <UserButton />
      {/* Optionally, you can add a custom button to trigger sign-out */}
      <button onClick={handleSignOut}>Sign Out and Clear Storage</button>
    </div>
  );
};

export default CustomUserButton;
