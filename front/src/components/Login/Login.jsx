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

function Login({
  setUserUID,
  setName,
  setExplorerId,
  setToken,
}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
    }); 
  
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [message, setMessage] = useState('');

  const onSubmit = async (data) => {

    try {
      const response = await axios.post(
        `${baseUrl}/login`,
        data,
      )
      const token = response.data.session.access_token;

      // Error if undefined is returned meaning that we don't have credentials in database
      if (token === undefined) {
        setErrMsg('Your logins do not exist.');
        localStorage.clear();
        navigate('/login');
        return;
      }

      // Error if undefined is returned meaning that we don't have credentials in database
      if (response.data.user === null) {
        setErrMsg('Your logins do not exist.');
        localStorage.clear();
        navigate('/login');
        return;
      }

      // If OK, set token and other user infos in props
      setToken(token);
      const userUID = response.data.user.id;
      setUserUID(userUID);
      setName('');
      setExplorerId('');
      // Retrieving explorer info from database
      const user = await axios.post(
        `${baseUrl}/login/user`,
        userUID,
        {headers: {
          authorization: token,
        },}
      )
      console.log("DM login response", user);
      setName(user.data.name);
      setExplorerId(user.data.id);
      localStorage.setItem('name', user.data.name);
      localStorage.setItem('explorerId', user.data.id);
      navigate('/menu');

    } catch (error) {
      if (!error?.response) {
        setMessage("The serveur did not respond.");
        setHiddenAlert(false);        
        console.log(message);
      }
      else {
        setMessage("Looks like you don't have an account or your login details do not match. Please try again.");
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
    <h1 className="login-title pb-5">Welcome to WeSwapCards!</h1>

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
                            required: 'Required field',
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
                        //   onChange={handleChange}
                        {...register('password', {
                          required: 'Password required',
                          pattern: {
                            value: /^(?=.*[0-9])[a-zA-Z0-9!@#,.$%?^&*]{6,16}$/,
                            message: 'The format is invalid. Your password must contain at least 1 number and 1 special character (!@#$?%^&*).',
                          },
                          minLength: {
                            value: 6,
                            message: 'Your password must contain between 6 and 16 characters.',
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
