import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatchContext } from '../../../../contexts/DispatchContext';
import { axiosInstance } from '../../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

const useLoginLogic = () => {
    const dispatch = useDispatchContext();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL
    const previousUrl = location.state?.from;
    // console.log(previousUrl);
  
    const { getToken } = useAuth()
    const { signOut } = useClerk();
  
    const [loading, setLoading] = useState(true);
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
  
    const handleSignOut = async () => {
      try {
        await signOut();
        navigate('/login', { replace: true });
      } catch (error) {
        // console.error('Error signing out:', error);
      }
    };
  
    const fetchUserData = async (userUID) => {
      const maxRetries = 3;
      const delayBetweenRetries = 1000;
  
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const userInfo = await axiosInstance.post(
            `/login/user`,
            { userUID },
            {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
              withCredentials: true,
            }
          );
  
          if (userInfo.data) {
            const explorerName = userInfo.data.name;
            const explorerId = userInfo.data.id;
  
            dispatch({
              type: 'explorer/set',
              payload: { explorerName, explorerId }
            })

            navigate('/menu');
            return;
          }
  
          if (!userInfo.data) {
            navigate('/register/user');
          } else {
            navigate(previousUrl); // Redirect user to page they were on before
          }
  
        } catch (error) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            setLoading(false);
            setHiddenAlert(false);
            setAlertMessage("There was an error during sign in");
            handleSignOut();
            return;
          }
        }
      }
    };
    
    // Fetch Clerk userid on mount
    useEffect(() => {
      dispatch({
        type: 'explorer/reset',
      })
  
     if (user) {
       const userUID = user.id;  // Clerk's userId
       fetchUserData(userUID);
     } else {
       handleSignOut();
     }
    }, []);

    return {
        loading,
        hiddenAlert,
        alertMessage
    }
}

export default useLoginLogic;