import React, { useState, useRef } from 'react';
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

import './registerStyles.scss';

function Register({
  setUserUID,
  setName,
  setExplorerId,
  setToken,
}) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
    }); 

    const [errMsg, setErrMsg] = useState('');
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [message, setMessage] = useState('This email address is already linked to an account. Please log in.');

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const onSubmit = async (data) => {

      try {
        const response = await axios.post(
          `${baseUrl}/register`,
          data,
        )
          console.log(response.data);

          // Error if undefined is returned meaning that we don't have credentials in database
          if (response.data.user === null) {
          // setErrMsg('There was an issue during registration.');
          setHiddenAlert(false);
          localStorage.clear();
          // navigate('/register');
          return;
          }

          // Retrieve token from response and store it in local storage
          const token = response.data.session.access_token;
          setToken(token);
          // Setting userUID from auth at App level
          setUserUID(response.data.user.id); 
          setName('');
          setExplorerId('');

          navigate('/register/user');

      } catch (error) {
        console.log(error.message);
      }
    };

    const password = useRef({});
    password.current = watch('password', '');

    // Show password feature with Eye icon
    const [showPassword, setShowPassword] = useState(false);

	  const onMouseDown = () => {
		setShowPassword(true)
    }
  
    const onMouseUp = () => {
    setShowPassword(false)
    }

  return (
    <Container className="register">
    <h1 className="login-title pb-5">To start swapping cards, create an account</h1>

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
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseLeave={onMouseUp}
                          onTouchStart={onMouseDown}
                          onTouchEnd={onMouseUp}>
                          {showPassword ? <EyeSlash /> : <Eye />}
                      </Button>
                      <FormControl
                          type={showPassword ? "text" : "password"}
                          className="shadow-none pr-4"
                          placeholder="Password"
                          aria-label="Explorer's password"
                          aria-describedby="basic-addon2"
                          {...register('password', {
                          required: 'Password required',
                          pattern: {
                            value: /^(?=.*[0-9])(?=.*[!@#$?%^&*])[a-zA-Z0-9!@#$%?^&*]{6,16}$/,
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

                <Form.Group className="mb-3" controlId="formGroupConfirmPwd">
                  <Form.Label className="form-label">Confirm password</Form.Label>
                  <InputGroup className="justify-content-end">
                      <InputGroup.Text>
                          <KeyFill />
                      </InputGroup.Text>
                      <Button
                          variant="white"
                          type="button"
                          aria-label="Show password"
                          className="my-1 btn-sm position-absolute"
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseLeave={onMouseUp}
                          onTouchStart={onMouseDown}
                          onTouchEnd={onMouseUp}>
                          {showPassword ? <EyeSlash /> : <Eye />}
                      </Button>
                      <FormControl
                          type={showPassword ? "text" : "password"}
                          className="shadow-none pr-4"
                          placeholder="Confirm password"
                          aria-label="Explorer's confirming password"
                          aria-describedby="basic-addon4"
                          {...register('confirm_password', {
                            validate: (value) => value === password.current || 'The passwords do not match. Please check.',
                          })}
                      />
                  </InputGroup>
                </Form.Group>

                {errors.confirm_password && <p className="errors">{errors.confirm_password.message}</p>}
                {<p className="errors">{errMsg}</p>}

                <Card.Text className="">
                    <Link to="/login" className="link">Already have an account?</Link>
				        </Card.Text>

                <CustomButton 
                  text="Register"
                />
              </Card.Body>
          </Card>
    </Form>

    </Container>
)
}

Register.propTypes = {
  setUserUID: PropTypes.func,
  setName: PropTypes.func,
  setExplorerId: PropTypes.func,
};

export default React.memo(Register);
