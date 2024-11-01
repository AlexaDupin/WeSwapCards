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

import {KeyFill, PersonFill, Eye, EyeSlash, At} from "react-bootstrap-icons";

// import PropTypes from 'prop-types';

import './registerStyles.scss';

function Register() {
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
    <Container className="register">
    <h1 className="login-title pb-5">To start swapping cards, create an account</h1>
    <Form>
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
                          aria-describedby="basic-addon1" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label className="form-label">Username</Form.Label>
                  <InputGroup className="">
                      <InputGroup.Text>
                          <PersonFill />
                      </InputGroup.Text>
                      <FormControl
                          placeholder="Username"
                          aria-label="Explorer's username"
                          aria-describedby="basic-addon2" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
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
                          aria-describedby="basic-addon3"
                        //   onChange={handleChange}
                      />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
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
                          placeholder="Confirm password"
                          aria-label="Explorer's confirming password"
                          aria-describedby="basic-addon4"
                        //   onChange={handleChange}
                      />
                  </InputGroup>
                </Form.Group>

                <Card.Text className="">
                    <Link to="/login" className="link">Already have an account?</Link>
				</Card.Text>

                <CustomButton />
              </Card.Body>
          </Card>
    </Form>
    </Container>
)
}

Register.propTypes = {

};

export default React.memo(Register);
