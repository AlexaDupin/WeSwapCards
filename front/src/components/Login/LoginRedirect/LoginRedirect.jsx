import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react'; // Clerk SignIn component

import {
  Container,
  Spinner,
  Alert
  } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import PropTypes from 'prop-types';

import './loginRedirectStyles.scss';

const LoginRedirect = ({
  setName,
  setExplorerId
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL
  const previousUrl = location.state?.from;
  console.log(previousUrl);

  const { getToken } = useAuth()
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(true);
  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Signed out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchUserData = async (userUID) => {
    try {
      console.log('REDIRECT entering try');
      const userInfo = await axiosInstance.post(
        `/login/user`,
        { userUID },
         {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        }
      );
      console.log("User data received:", userInfo.data);
      setName(userInfo.data.name);
      setExplorerId(userInfo.data.id);

      if (!userInfo.data) {
        navigate('/register/user');
      } else if (!location.state?.from) {
        navigate('/menu');
      } else {
        navigate(previousUrl); // Redirect them to the page they were on before
      }

    } catch (error) {
      setLoading(false);
      setHiddenAlert(false);
      setAlertMessage("There was an error during sign in");
      console.error('Error fetching user data:', error);
      handleSignOut();
    }
  };

  console.log('REDIRECT', user);

  // Fetch Clerk userid on mount
  useEffect(() => {
   console.log('REDIRECT entering useffect');

   if (user) {
     const userUID = user.id;  // Clerk's userId
     console.log("REDT user", user, user.id);
     fetchUserData(userUID);
   } else {
     handleSignOut();
   }
  }, []);

  return (
  <Container className="page-container">
    {loading &&
       <Spinner 
        animation="border"
        className="spinner" 
       />
    }

    {!loading &&
      <Alert
          variant='danger'
          className={hiddenAlert ? 'hidden-alert' : ''}>
          {alertMessage}
        </Alert>
    }
  </Container>
  )
}

LoginRedirect.propTypes = {
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(LoginRedirect);
