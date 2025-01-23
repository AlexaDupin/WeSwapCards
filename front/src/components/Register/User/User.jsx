import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import {
	Form,
	Card,
	InputGroup,
	FormControl,
  Container,
  Alert
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PersonFill } from "react-bootstrap-icons";

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import PropTypes from 'prop-types';

import CustomButton from '../../CustomButton/CustomButton';

import './userStyles.scss';

function User({
    setUserUID,
    setName,
    setExplorerId,
}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        username: "",
      },
    }); 

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [message, setMessage] = useState('You already have an account. Please log in.');

    const { getToken } = useAuth()
    const navigate = useNavigate();

    // Get the current user object from Clerk
    const { user } = useUser();
    const userUID = user.id;  
    console.log('User ID:', userUID);
    setUserUID(userUID);

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post(
              `/register/user`,
              { userUID, ...data },
              {
                headers: {
                  Authorization: `Bearer ${await getToken()}`,
                },
              });
            
            console.log("DM user response", response.data);

            // Setting name and explorerId at App level
            setExplorerId(response.data.user.id);
            setName(response.data.user.name);
            
            navigate('/menu');

        } catch (error) {
          if (error.response) {
            // If the backend returned an error with a message (e.g., 400 or 500 status)
            console.log("ERROR", error);
            console.log("Error from backend:", error, error.response.data.error);
            setExplorerId('');
            setName('');
            setMessage("This username is already taken. Please try another one.");
            setHiddenAlert(false);
          } else {
            // If the error is not from the server (e.g., network error)
            console.log("Network error or unexpected error:", error.message);
            setExplorerId('');
            setName('');
            setMessage("An unexpected error occurred. Please try again later.");
            setHiddenAlert(false);
          }
        }    
    };
   
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
                              value: /^[a-zA-Z0-9]{2,}$/,
                              message: 'The format is invalid. Your username must contain at least 2 letters or numbers.',
                            },
                            minLength: {
                              value: 2,
                              message: 'Your username must contain at least 2 characters.',
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

User.propTypes = {
    setUserUID: PropTypes.func,
    setName: PropTypes.func,
    setExplorerId: PropTypes.func,
};

export default React.memo(User);
