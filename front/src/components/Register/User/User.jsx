import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

import {
	Form,
	Card,
	InputGroup,
	FormControl,
  Container,
  Alert,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PersonFill } from "react-bootstrap-icons";

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import CustomButton from '../../CustomButton/CustomButton';
import DOMPurify from 'dompurify';

import { useDispatchContext } from '../../../contexts/DispatchContext';

import './userStyles.scss';

const User = () => {
  const dispatch = useDispatchContext();

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [message, setMessage] = useState('You already have an account. Please log in.');
    const navigate = useNavigate();
    const { getToken } = useAuth()
    const { signOut } = useClerk();

    // Get the user info from Clerk
    const { user } = useUser();
    // console.log("REGISTER USER", user);
    const userUID = user.id;
    const userEmail = user.emailAddresses[0].emailAddress;  
    // console.log('User ID:', userUID);

    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        username: "",
      },
    }); 

    // Insert user in database with username and Clerk id
    const onSubmit = async (data) => {
      const sanitizedUsername = DOMPurify.sanitize(data.username);

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axiosInstance.post(
              `/register/user`,
              { userUID, userEmail, sanitizedUsername },
              {
                headers: {
                  Authorization: `Bearer ${await getToken()}`,
                },
                withCredentials: true,
              }
            );

            const fetchedExplorerId = response.data.user.id;
            const fetchedExplorerName = response.data.user.name;

            
            // console.log("DM user response", response.data);

            if (response.status === 201) {
              // Setting name and explorerId at App level

              dispatch({
                type: 'explorer/created',
                payload: { 
                  fetchedExplorerId, 
                  fetchedExplorerName
                }
              })
              // setExplorerId(response.data.user.id);
              // setName(response.data.user.name);
              navigate('/menu', { state: { from: "/register/user" } });
              return;
            } else {
              // dispatch({
              //   type: 'explorer/notCreated',
              // })
              setMessage("There was an issue while submitting your username.");
              setHiddenAlert(false);
              // console.error("Failed to create user");
              return;
            }

        } catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.error;
            // Check if the error message is for duplicate userUID
            if (errorMessage.includes("is already registered")) {
              dispatch({
                type: 'explorer/reset',
              })
              // setExplorerId('');
              // setName('');
              setMessage("You already chose a username. You can go back to the menu.");
              setHiddenAlert(false);
              return;
            } else if (errorMessage.includes("already taken")) {
              // Handle duplicate username error
              dispatch({
                type: 'explorer/reset',
              })
              // setExplorerId('');
              // setName('');
              setMessage("This username is already taken. Please try another one.");
              setHiddenAlert(false);
              return;
            } else {
              // Handle other backend errors
              dispatch({
                type: 'explorer/reset',
              })
              // setExplorerId('');
              // setName('');
              setMessage("There was an issue with your request. Please try again.");
              setHiddenAlert(false);
              return;
            }
          } else {
            // console.error(`Attempt ${attempt} to create user:`, error);
            if (attempt < maxRetries) {
              // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
            } else {
              // If the error is not from the server (e.g., network error)
              // console.log("Network error or unexpected error:", error.message);
              dispatch({
                type: 'explorer/reset',
              })
              // setExplorerId('');
              // setName('');
              setMessage("An unexpected error occurred. Please try again later.");
              setHiddenAlert(false);
              return;
            }
          }
        }
      }  
    };

    useEffect(() => {
      dispatch({
        type: 'user/reset',
      })
      // setName("");
      // setExplorerId("");
      
      if (user) {
        dispatch({
          type: 'user/fetched',
          payload: userUID
        })
        // setUserUID(userUID);
      } else {
        signOut();
      }
    }, []);
   
  return (
    <Container className="page-container">
    <h1 className="user-title pb-1">Enter a username</h1>
    <p className="user-subtitle pb-3">It will be shown to other users when you have a card they are interested in.
    You can use the username you use on the WeWard app to make things easier.
    </p>

    <Alert 
      variant="danger"
      className={hiddenAlert ? 'hidden-alert' : ''}>
        {message}      
    </Alert>

    <Form onSubmit={handleSubmit(onSubmit)}>

          <Card className="bg-light">
              <Card.Body className="">
              <Form.Group className="mb-3" controlId="formGroupUsername">
                  <Form.Label className="form-label">Username</Form.Label>
                  <InputGroup className="">
                      <InputGroup.Text>
                          <PersonFill />
                      </InputGroup.Text>
                      <FormControl
                          placeholder="Username"
                          aria-label="Explorer's username"
                          aria-describedby="basic-addon1"
                          {...register('username', {
                            required: 'Please enter a username.',
                            pattern: {
                              value: /^[a-zA-Z0-9_]{2,20}$/,
                              message: 'The format is invalid. Your username must contain between 2 and 20 letters and/or numbers, and no special characters.',
                            },
                            minLength: {
                              value: 2,
                              message: 'Your username must contain at least 2 characters.',
                            },
                            maxLength: {
                              value: 30,
                              message: 'Your username must contain 20 characters max.',
                            },
                            },
                          )}
                      />
                  </InputGroup>
                </Form.Group>

                {errors.username && <p className="errors">{errors.username.message}</p>}

                <CustomButton 
                  text="Submit"
                />
              </Card.Body>
          </Card>
    </Form>
    </Container>
)
}

export default React.memo(User);
