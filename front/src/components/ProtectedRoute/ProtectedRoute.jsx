import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ element, ...rest }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    // If the user is not signed in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is signed in, render the passed in element (route content)
  return element;
};

export default ProtectedRoute;
