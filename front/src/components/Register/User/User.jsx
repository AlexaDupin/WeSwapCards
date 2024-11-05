import React, { useState, useRef } from 'react';
import {
	Form,
	Card,
	InputGroup,
	FormControl,
    Container
} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import CustomButton from '../../CustomButton/CustomButton';

import { PersonFill } from "react-bootstrap-icons";

// import PropTypes from 'prop-types';

import './userStyles.scss';

function User() {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
    }); 

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const onSubmit = (data) => {
      axios
        .post(
          `${baseUrl}/register/user`,
          data,
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.data);
        });
      navigate('/menu');
    };

  return (
    <Container className="user">
    <h1 className="user-title pb-1">Enter a username</h1>
    <p className="user-subtitle pb-3">It will be shown to other users when you have a card they are interested in.
    You can use the username you use on the WeWard app to make things easier.
    </p>

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
                            required: 'This field is required',
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

};

export default React.memo(User);
