import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react'; // Clerk SignIn component

import {
	Form,
	Button,
	Card,
	InputGroup,
	FormControl,
  Container,
  Alert
} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import CustomButton from '../CustomButton/CustomButton';

import PropTypes from 'prop-types';

import './loginStyles.scss';

function Login({
  setUserUID,
  setName,
  setExplorerId,
  setToken,
  setUser,
  setSession,
  setIsLogged
}) {
  const navigate = useNavigate();

 

  return (
    <Container className="page-container">
    <h1 className="login-title pb-5">Login to access your account and swap cards!</h1>
      <SignIn path="/sign-in" routing="path" />
    <p className="register-disclaimer">By signing in or creating an account, you agree with the use of the information provided as explained in our <a href="/privacy" target="_blank">Privacy Policy</a> and our <a href="/terms" target="_blank">Terms and Conditions</a>. Only the username provided during registration will be shown to other users.</p>
    </Container>
)
}

Login.propTypes = {
  setUserUID: PropTypes.func,
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(Login);
