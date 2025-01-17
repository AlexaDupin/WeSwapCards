import React from 'react';
import { SignUp, useClerk, useUser } from '@clerk/clerk-react'; // Import Clerk's SignUp component

import {
  Container,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PropTypes from 'prop-types';

import './registerStyles.scss';

function SignUpPage({    
  setName,
  setExplorerId
}) {

  const { getToken } = useClerk();
  const { user } = useUser();  // Access the Clerk user object after sign-up
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // const handleSignUp = async (userData) => {
  //   console.log("SIGN UP PAGE");

  //   const token = await getToken(); // Get the Clerk JWT token
  //   console.log("SIGN UP PAGE token", token);

  //   const username = user.username; // Clerk's username field
  //   console.log("SIGN UP PAGE username", username);

  //   if (!username) {
  //     console.error('Username is required');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}/signup`, 
  //       { username },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Token sent in the Authorization header
  //         },
  //       }
  //     );
  //     console.log('User registered:', response.data);
  //   } catch (error) {
  //     console.error('Error during sign-up:', error);
  //   }
  // };

  return (
    <Container className="page-container">
      <h1 className="page-title">Sign Up</h1>
      <div className="signup-container">
        <SignUp 
          path="/register"
          routing="path" 
          forceRedirectUrl="/register/user"
        />
      </div>
    </Container>
)
}

SignUpPage.propTypes = {
  setUserUID: PropTypes.func,
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(SignUpPage);
