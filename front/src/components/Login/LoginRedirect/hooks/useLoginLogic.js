import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatchContext } from '../../../../contexts/DispatchContext';
import { axiosInstance } from '../../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

const useLoginLogic = () => {
    const dispatch = useDispatchContext();
    const { isLoaded, isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const from = params.get('from');

    const { getToken } = useAuth()
    const { signOut } = useClerk();
  
    const [loading, setLoading] = useState(true);
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
  
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

            navigate(from || '/menu', { replace: true });
            return;
          }
  
          navigate({
            pathname: '/register/user',
            search: from ? `?from=${encodeURIComponent(from)}` : '',
          });
          return;
  
        } catch (error) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            setLoading(false);
            setHiddenAlert(false);
            setAlertMessage("There was an error during sign in");
            if (isSignedIn) {
              try { await signOut(); } catch {}
            }
            navigate(`/login${from ? `?from=${encodeURIComponent(from)}` : ''}`, { replace: true });
            return;
          }
        }
      }
    };
    
    // Fetch Clerk userid on mount
    useEffect(() => {
      if (!isLoaded) return;

      dispatch({
        type: 'explorer/reset',
      })
  
      if (!isSignedIn || !user) {
        navigate(`/login${from ? `?from=${encodeURIComponent(from)}` : ''}`, { replace: true });
        return;
      }

      fetchUserData(user.id);

    }, [isLoaded, isSignedIn, user]);

    return {
        loading,
        hiddenAlert,
        alertMessage
    }
}

export default useLoginLogic;