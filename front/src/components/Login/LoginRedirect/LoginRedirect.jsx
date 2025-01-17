import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react'; // Clerk SignIn component

import {
  Container,
  Spinner
  } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PropTypes from 'prop-types';

import './loginRedirectStyles.scss';

const LoginRedirect = ({
  setName,
  setExplorerId
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
   const fetchUserData = async (userUID) => {
    try {
      const userInfo = await axios.post(
        `${baseUrl}/login/user`,
        { userUID }
      );
      console.log("User data received:", userInfo.data);
      setName(userInfo.data.name);
      setExplorerId(userInfo.data.id);
      navigate('/menu');

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (user) {
    const userUID = user.id;  // Clerk's userId
    console.log("REDT user", user, user.id);
    fetchUserData(userUID);
  }
}, []);

  return (
  <Container className="page-container">
       <Spinner 
        animation="border"
        className="spinner" 
       />
  </Container>
  )
}

LoginRedirect.propTypes = {
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(LoginRedirect);
