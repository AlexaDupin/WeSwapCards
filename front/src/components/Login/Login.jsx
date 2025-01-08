import React, { useState } from 'react';
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

import {KeyFill, Eye, EyeSlash, At} from "react-bootstrap-icons";

import PropTypes from 'prop-types';

import './loginStyles.scss';
import supabase from '../../helpers/Supabase';

function Login({
  setUserUID,
  setName,
  setExplorerId,
  setToken,
  setUser,
  setSession,
  setIsLogged
}) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  }); 

  const onSubmit = async (data) => {
    console.log('DATA', data.email, data.password);
    try {
      const response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
  
      console.log('AUTH response', response);
      console.log('AUTH user session', response.data.user, response.data.session);

      if (response.error) {
        // setErrMsg('Login failed: ' + response.error.message);
        setErrMsg('');
        setMessage('We could not log you in. Please check your email address and password.');
        setHiddenAlert(false);        
        return;
      }

      const { user, session } = response.data;

      // Store the session in localStorage manually
      if (session) {
        localStorage.setItem('supabase_session', JSON.stringify(session));
      }

      // Store other user-related data if needed
      localStorage.setItem('user', JSON.stringify(user));
      const token = session.access_token;
      setToken(token);
      setIsLogged(true);
      setUser(user);
      setSession(session);
  
      const userUID = response.data.user.id;
      setUserUID(userUID);
      setName('');
      setExplorerId('');

      // Retrieving explorer info from database
      const userInfo = await axios.post(
        `${baseUrl}/login/user`,
        {userUID},
        {headers: {
          authorization: response.data.session.access_token,
        },
        withCredentials: true,  // Ensure credentials (cookies) are sent
      })
      console.log("DM login response", user);
      setName(userInfo.data.name);
      setExplorerId(userInfo.data.id);
      localStorage.setItem('name', userInfo.data.name);
      localStorage.setItem('explorerId', userInfo.data.id);

      // After successful login, redirect to the menu or dashboard
      navigate('/menu');
  
  
    } catch (error) {
        if (!error?.response) {
          setMessage("The serveur did not respond.");
          setErrMsg('An error occurred during login: ' + error.message);
          setHiddenAlert(false);        
          console.log(message);
        }
        else {
          setMessage("Looks like you don't have an account or your password is not correct. Please try again.");
          setHiddenAlert(false);
          console.log("401 Unauthorized");      
        }
    }
  };
  
  // Show password feature with Eye icon
  const [showPassword, setShowPassword] = useState(false)

	const onMouseDown = () => {
		setShowPassword(true)
  }
  
  const onMouseUp = () => {
    setShowPassword(false)
  }

  return (
    <Container className="login">
    <h1 className="login-title pb-5">Login to access your account and swap cards!</h1>

    <Alert 
      variant="danger"
      className={hiddenAlert ? 'hidden-alert' : ''}>
        {message}      
    </Alert>

    <Form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-light">
            <Card.Body className="">
              
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label className="form-label">Email address</Form.Label>
                  <InputGroup className="">
                      <InputGroup.Text>
                          <At />
                      </InputGroup.Text>
                      <FormControl
                          placeholder="Email"
                          aria-label="Explorer's email"
                          aria-describedby="basic-addon1" 
                          {...register('email', {
                            required: 'Please enter an email address.',
                            pattern: {
                              value: /(.+)@(.+){2,}\.(.+){2,}/,
                              message: 'Invalid email format',
                            },
                          })}
                          />
                  </InputGroup>
                </Form.Group>

                {errors.email && <p className="errors">{errors.email.message}</p>}

                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <InputGroup className="justify-content-end">
                      <InputGroup.Text>
                          <KeyFill />
                      </InputGroup.Text>
                      <Button
                          variant="white"
                          type="button"
                          aria-label="Show password"
                          className="my-1 btn-sm position-absolute"
                        //   style={{ zIndex: 4 }}
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseLeave={onMouseUp}
                          onTouchStart={onMouseDown}
                          onTouchEnd={onMouseUp}>
                          {/* {showEye ? showPassword ? <EyeSlash /> : <Eye /> : null} */}
                          {showPassword ? <EyeSlash /> : <Eye />}
                      </Button>
                      <FormControl
                          type={showPassword ? "text" : "password"}
                          className="shadow-none pr-4"
                          placeholder="Password"
                          aria-label="Explorer's password"
                          aria-describedby="basic-addon2"
                        {...register('password', {
                          required: 'Please enter your password.',
                          pattern: {
                            // value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/,
                            message: 'The format is invalid. Your password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character.',
                          },
                          minLength: {
                            value: 8,
                            message: 'Your password must contain between 8 and 16 characters.',
                          },
                          maxLength: {
                            value: 16,
                            message: 'Your password must contain between 8 and 16 characters.',
                          },
                        })}
                      />
                  </InputGroup>
                </Form.Group>

                {errors.password && <p className="errors">{errors.password.message}</p>}
                {<p className="errors">{errMsg}</p>}

                <Card.Text className="">
                    <Link to="#" className="link">Forgot Password?</Link>
						    &nbsp;&nbsp;
                    <Link to="/register" className="link">Don't have an account?</Link>
				        </Card.Text>

                <CustomButton 
                  text="Login"
                />
              </Card.Body>
          </Card>
    </Form>

    </Container>
)
}

Login.propTypes = {
  setUserUID: PropTypes.func,
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(Login);
