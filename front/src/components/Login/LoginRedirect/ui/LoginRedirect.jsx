import React from 'react';
import {
  Container,
  Spinner,
  Alert
  } from "react-bootstrap";
import useLoginLogic from '../hooks/useLoginLogic';
import './loginRedirectStyles.scss';

const LoginRedirect = () => {
  const {
    loading,
    hiddenAlert,
    alertMessage
  } = useLoginLogic();

  return (
  <Container className="page-container">
    {loading &&
       <Spinner 
        animation="border"
        className="spinner" 
       />
    }

    {!loading &&
      <Alert
          variant='danger'
          className={hiddenAlert ? 'hidden-alert' : ''}>
          {alertMessage}
        </Alert>
    }
  </Container>
  )
}

export default React.memo(LoginRedirect);
