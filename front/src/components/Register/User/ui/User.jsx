import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageContainer from '../../../PageContainer/PageContainer';
import {
  Form, Card, InputGroup, FormControl, Alert,
} from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import CustomButton from '../../../CustomButton/CustomButton';
import { axiosInstance } from '../../../../helpers/axiosInstance';
import DOMPurify from 'dompurify';
import './userStyles.scss';

function User() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(true);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { username: '' },
  });

  // 1) On load: if username exists already, redirect back
  useEffect(() => {
    let active = true;
    (async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const res = await axiosInstance.post(
          '/login/user',
          { userUID: user?.id },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );

        if (!active) return;
        if (res.status === 200 && res.data && (res.data.name || res.data.username)) {
          const rawFrom = (location.state && location.state.from) || '/menu';
          const safeFrom = rawFrom === '/register/user' ? '/menu' : rawFrom;
          navigate(safeFrom, { replace: true });
          return;
        }
      } catch {
        // 404 → ok, show form
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => { active = false; };
  }, [isSignedIn, getToken, user, navigate, location.state]);

  // 2) Submit: create username then redirect back
  const onSubmit = async ({ username }) => {
    const sanitizedUsername = DOMPurify.sanitize(username);

    if (!sanitizedUsername) {
      setMessage('Please enter a valid username.');
      setHiddenAlert(false);
      return;
    }

    try {
      const token = await getToken();
      const payload = {
        userUID: user?.id,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        sanitizedUsername, // matches your controller signature
      };
      const res = await axiosInstance.post('/register/user', payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.status === 201 && res.data?.user?.name) {
        const rawFrom = (location.state && location.state.from) || '/menu';
        const safeFrom = rawFrom === '/register/user' ? '/menu' : rawFrom;
        navigate(safeFrom, { replace: true });
      } else {
        setMessage('There was an issue while submitting your username.');
        setHiddenAlert(false);
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.error;
      if (serverMsg?.includes('already registered')) {
        setMessage('You already chose a username. You can go back to the menu.');
      } else if (serverMsg?.includes('already taken')) {
        setMessage('This username is already taken. Please try another one.');
      } else if (serverMsg?.includes('format')) {
        setMessage('Invalid format. Use 2–20 letters, numbers, or underscores.');
      } else {
        setMessage('There was an issue with your request. Please try again.');
      }
      setHiddenAlert(false);
    }
  };

  // Clear alert on edit
  const usernameValue = watch('username');
  useEffect(() => { if (!hiddenAlert) setHiddenAlert(true); }, [usernameValue]); // eslint-disable-line

  if (checking) return null;

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
                  {...register('username', {
                    required: 'Please enter a username.',
                    pattern: {
                      value: /^[a-zA-Z0-9_]{2,20}$/,
                      message: 'Invalid format. Use 2–20 letters/numbers/underscore.',
                    },
                    minLength: { value: 2, message: 'At least 2 characters.' },
                    maxLength: { value: 20, message: 'Max 20 characters.' },
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
}

export default React.memo(User);



// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PageContainer from '../../../PageContainer/PageContainer';
// import { useStateContext } from '../../../../contexts/StateContext';

// import {
// 	Form,
// 	Card,
// 	InputGroup,
// 	FormControl,
//   Alert,
// } from "react-bootstrap";
// import { PersonFill } from "react-bootstrap-icons";
// import CustomButton from '../../../CustomButton/CustomButton';
// import './userStyles.scss';
// import useUserLogic from '../hooks/useUserLogic';

// const User = () => {
//   const {
//     hiddenAlert,
//     message,
//     handleSubmit,
//     onSubmit,
//     register,
//     errors,
//   } = useUserLogic();

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { explorer } = useStateContext();
  
//   useEffect(() => {
//     if (explorer && explorer.name) {
//       const from = (location.state && location.state.from) || '/';
//       navigate(from, { replace: true });
//     }
//   }, [explorer, location.state, navigate]);
   
//   return (
//     <PageContainer>
//       <h1 className="user-title pb-1">Enter a username</h1>
//       <p className="user-subtitle pb-3">It will be shown to other users when you have a card they are interested in.
//       <br/>Use your WeWard username to make things easier.
//       </p>

//       <Alert 
//         variant="danger"
//         className={hiddenAlert ? 'hidden-alert' : ''}>
//           {message}      
//       </Alert>

//       <Form onSubmit={handleSubmit(onSubmit)}>

//             <Card className="bg-light">
//                 <Card.Body className="">
//                 <Form.Group className="mb-3" controlId="formGroupUsername">
//                     <Form.Label className="form-label">Username</Form.Label>
//                     <InputGroup className="">
//                         <InputGroup.Text>
//                             <PersonFill />
//                         </InputGroup.Text>
//                         <FormControl
//                             placeholder="Enter a username"
//                             aria-label="Username"
//                             aria-describedby="basic-addon1"
//                             {...register('username', {
//                               required: 'Please enter a username.',
//                               pattern: {
//                                 value: /^[a-zA-Z0-9_]{2,20}$/,
//                                 message: 'The format is invalid. Your username must contain between 2 and 20 letters and/or numbers, and no special characters.',
//                               },
//                               minLength: {
//                                 value: 2,
//                                 message: 'Your username must contain at least 2 characters.',
//                               },
//                               maxLength: {
//                                 value: 20,
//                                 message: 'Your username must contain 20 characters max.',
//                               },
//                               },
//                             )}
//                         />
//                     </InputGroup>
//                   </Form.Group>

//                   {errors.username && <p className="errors">{errors.username.message}</p>}

//                   <CustomButton 
//                     text="Submit"
//                   />
//                 </Card.Body>
//             </Card>
//       </Form>
//     </PageContainer>
//   )
// }

// export default React.memo(User);
