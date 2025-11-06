import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import DOMPurify from 'dompurify';
import { useDispatchContext } from '../../../../contexts/DispatchContext';

const useUserLogic = () => {
    const dispatch = useDispatchContext();

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [message, setMessage] = useState('You already have an account. Please log in.');
    const navigate = useNavigate();
    const location = useLocation();

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

      if (!sanitizedUsername) {
        setMessage('Please enter a valid username.');
        setHiddenAlert(false);
        return;
      }

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      let token;
      try { token = await getToken(); } catch {}
      if (!token) {
        setMessage('Authentication error. Please try again.');
        setHiddenAlert(false);
        return;
      }

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axiosInstance.post(
              `/register/user`,
              { userUID, userEmail, sanitizedUsername },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );

            if (response.status === 201 && response.data?.user?.id && response.data?.user?.name) {
              const fetchedExplorerId = String(response.data.user.id);
              const fetchedExplorerName = String(response.data.user.name);
    
              dispatch({
                type: 'explorer/set',
                payload: { explorerId: fetchedExplorerId, explorerName: fetchedExplorerName }
              });
              
              const rawFrom = (location.state && location.state.from) || '/menu';
              const safeFrom = rawFrom === '/register/user' ? '/menu' : rawFrom;
              navigate(safeFrom, { replace: true });
              return;
            } 
            
              setMessage("There was an issue while submitting your username.");
              setHiddenAlert(false);
              return;

        } catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.error;
            // Check if the error message is for duplicate userUID
            if (errorMessage.includes("is already registered")) {
              try {
                const res = await axiosInstance.post(
                  '/login/user',
                  { userUID },
                  { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
    
                if (res.status === 200 && res.data?.id && (res.data?.name || res.data?.username)) {
                  const id = String(res.data.id);
                  const name = String(res.data.name || res.data.username);
    
                  dispatch({
                    type: 'explorer/set',
                    payload: { explorerId: id, explorerName: name }
                  });
                }
              } catch {}
    
              const rawFrom = (location.state && location.state.from) || '/menu';
              const safeFrom = rawFrom === '/register/user' ? '/menu' : rawFrom;
              navigate(safeFrom, { replace: true });
              return;
            
            } else {
              // Handle other backend errors
              dispatch({
                type: 'explorer/reset',
              })
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

    return {
        hiddenAlert,
        message,
        handleSubmit,
        onSubmit,
        register,
        errors,
        
    }
}

export default useUserLogic;