import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react'; // Import useAuth from Clerk

// Create context for token
const TokenContext = createContext(null);

// Custom hook to access the token context
export const useToken = () => {
  return useContext(TokenContext);
};

// TokenProvider component to provide the token globally
export const TokenProvider = ({ children }) => {
  const { getToken } = useAuth(); // Fetch the token using Clerk's hook
  const [token, setToken] = useState(null);

  // Fetch token when the component mounts
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      if (fetchedToken) {
        setToken(fetchedToken);
      }
    };
    fetchToken();
  }, [getToken]); // Triggered when getToken is available
  
  return (
    <TokenContext.Provider value={token}>
      {children}
    </TokenContext.Provider>
  );
};
