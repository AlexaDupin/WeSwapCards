import axios from 'axios';
// import { useToken } from './TokenContext'; // Access the token via the custom hook
// import { useEffect } from 'react';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Set the base URL for your API
});

// // Custom hook to set up the Axios interceptor
// export const useAxiosInterceptor = () => {
//   const token = useToken(); // Get the token from the context
//   console.log("AXIOS token", token);

//   useEffect(() => {
//     // If the token is available, set it as the Authorization header
//     if (token) {
//       console.log("AXIOS token SEND");
//       axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
//     } else {
//       console.log("AXIOS NO token");
//       // If no token, remove the Authorization header
//       delete axiosInstance.defaults.headers['Authorization'];
//       return;
//     }
//   }, [token]); // Re-run the effect whenever the token changes

// };

export { axiosInstance };
