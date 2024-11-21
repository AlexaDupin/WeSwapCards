import { useState } from 'react';

export default function useToken() {
  // Get token from localStorage
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  // Store token in localStorage
  const storeToken = (retrievedToken) => {
    if (!retrievedToken) {
      return;
    }
    localStorage.setItem('token', JSON.stringify(retrievedToken));
    setToken(retrievedToken);
  };

  return {
    setToken: storeToken,
    token,
  };
}
