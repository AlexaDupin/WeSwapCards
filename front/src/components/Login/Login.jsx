import React, { useState } from 'react';
import {
	Form,
	Button,
	Card,
	InputGroup,
	FormControl,
    Container
} from "react-bootstrap";
import { Link } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

import {KeyFill, PersonFill, Eye, EyeSlash} from "react-bootstrap-icons";

// import PropTypes from 'prop-types';

import './loginStyles.scss';

function Login() {
    const [showPassword, setShowPassword] = useState(false)
	const [showEye, setShowEye] = useState(false)

	const handleChange = (event) => {
		if (event.target.value !== ""){
			setShowEye(true)
		} else {
			setShowEye(false)
		}
  }

	const onMouseDown = () => {
		setShowPassword(true)
  }
  
  const onMouseUp = () => {
    setShowPassword(false)
  }
  return (
    <Container className="pt-5">
    <h1 className="login-title pt-5">Welcome to WeSwapCards!</h1>
    <Form className="login d-flex my-3">
          <Card className="text-center mx-auto bg-light">

              <Card.Body className="">

                  {/* <Card.Header className="">
                      <span>Login to continue</span>
                  </Card.Header> */}

                  <InputGroup className="my-3">
                      <InputGroup.Text>
                          <PersonFill />
                      </InputGroup.Text>
                      <FormControl
                          placeholder="Username"
                          aria-label="Explorer's username"
                          aria-describedby="basic-addon1" />
                  </InputGroup>

                  <InputGroup className="justify-content-end">
                      <InputGroup.Text>
                          <KeyFill />
                      </InputGroup.Text>
                      <Button
                          variant="white"
                          className="my-1 mr-1 px-0 btn-sm bg-white shadow-none position-absolute"
                          style={{ zIndex: 4 }}
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseLeave={onMouseUp}
                          onTouchStart={onMouseDown}
                          onTouchEnd={onMouseUp}>
                          {showEye ? showPassword ? <EyeSlash /> : <Eye /> : null}
                      </Button>
                      <FormControl
                          type={showPassword ? "text" : "password"}
                          className="shadow-none pr-4"
                          placeholder="Password"
                          onChange={handleChange} />
                  </InputGroup>

                  <Card.Text className="mt-3">
                        <Link to="#" className="link">Forgot Password?</Link>
						&nbsp;&nbsp;
                        <Link to="/register" className="link">Don't have an account?</Link>
					</Card.Text>

                  <CustomButton />
              </Card.Body>
          </Card>
      </Form></Container>
)
}

Login.propTypes = {

};

export default React.memo(Login);
