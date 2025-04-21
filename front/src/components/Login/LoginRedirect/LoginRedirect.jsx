import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react'; // Clerk SignIn component

import {
  Container,
  Spinner,
  Alert
  } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatchContext } from '../../../contexts/DispatchContext';

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import './loginRedirectStyles.scss';

const LoginRedirect = () => {
  const dispatch = useDispatchContext();

  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL
  const previousUrl = location.state?.from;
  // console.log(previousUrl);

  const { getToken } = useAuth()
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(true);
  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      // console.log('Signed out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      // console.error('Error signing out:', error);
    }
  };

  const fetchUserData = async (userUID) => {
    const maxRetries = 3;
    const delayBetweenRetries = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // console.log('REDIRECT entering try');
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
        // console.log("User data received:", userInfo);

        if (userInfo.data) {
          const explorerName = userInfo.data.name;
          const explorerId = userInfo.data.id;

          dispatch({
            type: 'explorer/set',
            payload: { explorerName, explorerId }
          })
          // setName(userInfo.data.name);
          // setExplorerId(userInfo.data.id);
          navigate('/menu');
          return;
        }

        if (!userInfo.data) {
          navigate('/register/user');
        } else {
          navigate(previousUrl); // Redirect user to page they were on before
        }

      } catch (error) {
        // console.error(`Attempt ${attempt} to fetch user:`, error);
        if (attempt < maxRetries) {
          // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
        } else {
          setLoading(false);
          setHiddenAlert(false);
          setAlertMessage("There was an error during sign in");
          // console.error('Error fetching user data:', error);
          handleSignOut();
          return;
        }
      }
    }
  };

  // console.log('REDIRECT', user);

  // Fetch Clerk userid on mount
  useEffect(() => {
  //  console.log('REDIRECT entering useffect');
    dispatch({
      type: 'explorer/reset',
    })
  //  setName("");
  //  setExplorerId("");

   if (user) {
     const userUID = user.id;  // Clerk's userId
    //  console.log("REDT user", user, user.id);
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

export default React.memo(LoginRedirect);
