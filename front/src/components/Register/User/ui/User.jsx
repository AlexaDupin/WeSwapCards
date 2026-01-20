import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../PageContainer/PageContainer';
import { useStateContext } from '../../../../contexts/StateContext';

import {
  Form,
  Card,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import CustomButton from '../../../CustomButton/CustomButton';
import './userStyles.scss';
import useUserLogic from '../hooks/useUserLogic';

const User = () => {
  const {
    hiddenAlert,
    message,
    handleSubmit,
    onSubmit,
    register,
    errors,
  } = useUserLogic();

  const location = useLocation();
  const navigate = useNavigate();
  const { explorer } = useStateContext();

  const safeFrom = useMemo(() => {
    const rawFrom = (location.state && location.state.from) || '/menu';
    return rawFrom === '/register/user' ? '/menu' : rawFrom;
  }, [location.state]);

  useEffect(() => {
    if (explorer && explorer.name) {
      navigate(safeFrom, { replace: true });
    }
  }, [explorer, navigate, safeFrom]);

  return (
    <PageContainer>
      <h1 className="user-title pb-1">Enter a username</h1>
      <p className="user-subtitle pb-3">
        It will be shown to other users when you have a card they are interested in.
        <br />Use your WeWard username to make things easier.
      </p>

      <Alert variant="danger" className={hiddenAlert ? 'hidden-alert' : ''}>
        {message}
      </Alert>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-light">
          <Card.Body>
            <Form.Group className="mb-3" controlId="formGroupUsername">
              <Form.Label className="form-label">Username</Form.Label>
              <InputGroup>
                <InputGroup.Text><PersonFill /></InputGroup.Text>
                <FormControl
                  placeholder="Enter a username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  {...register('username', {
                    required: 'Please enter a username.',
                    pattern: {
                      value: /^[a-zA-Z0-9_]{2,20}$/,
                      message: 'The format is invalid. Your username must contain between 2 and 20 letters and/or numbers, and no special characters.',
                    },
                    minLength: { value: 2, message: 'Your username must contain at least 2 characters.' },
                    maxLength: { value: 20, message: 'Your username must contain 20 characters max.' },
                  })}
                />
              </InputGroup>
            </Form.Group>

            {errors.username && <p className="errors">{errors.username.message}</p>}
            <CustomButton text="Submit" />
          </Card.Body>
        </Card>
      </Form>
    </PageContainer>
  );
};

export default React.memo(User);