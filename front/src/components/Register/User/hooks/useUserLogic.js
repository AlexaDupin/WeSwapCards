import { useEffect, useMemo, useState } from 'react';
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

  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  // Safe user info access (Clerk can be undefined before isLoaded)
  const userUID = user?.id || '';
  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  // Form state & validation (react-hook-form)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { username: '' } });

  // Safe redirect target
  const safeFrom = useMemo(() => {
    const rawFrom = (location.state && location.state.from) || '/menu';
    return rawFrom === '/register/user' ? '/menu' : rawFrom;
  }, [location.state]);

  // Hide alert when user edits input
  const usernameValue = watch('username');
  useEffect(() => {
    if (!hiddenAlert) setHiddenAlert(true);
  }, [usernameValue, hiddenAlert]);

  // Submit handler
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
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.status === 201 && response.data?.user?.id && response.data?.user?.name) {
          const fetchedExplorerId = String(response.data.user.id);
          const fetchedExplorerName = String(response.data.user.name);

          // Store explorer in global reducer (same as before)
          dispatch({
            type: 'explorer/set',
            payload: { explorerId: fetchedExplorerId, explorerName: fetchedExplorerName }
          });

          navigate(safeFrom, { replace: true });
          return;
        }

        setMessage("There was an issue while submitting your username.");
        setHiddenAlert(false);
        return;

      } catch (error) {
        if (error?.response) {
          const errorMessage = error.response.data?.error ?? '';

          // Duplicate user UID → just log them in
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

            navigate(safeFrom, { replace: true });
            return;
          }

          // Other backend error
          dispatch({ type: 'explorer/reset' });
          setMessage("There was an issue with your request. Please try again.");
          setHiddenAlert(false);
          return;
        }

        // Network or unexpected error with retry
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, delayBetweenRetries));
        } else {
          dispatch({ type: 'explorer/reset' });
          setMessage("An unexpected error occurred. Please try again later.");
          setHiddenAlert(false);
          return;
        }
      }
    }
  };

  // Initial sync with reducer (same behavior as your former version)
  useEffect(() => {
    if (!isLoaded) return;

    dispatch({ type: 'user/reset' });

    if (isSignedIn && userUID) {
      dispatch({ type: 'user/fetched', payload: userUID });
    } else {
      signOut();
    }
  }, [dispatch, isLoaded, isSignedIn, userUID, signOut]);

  return {
    hiddenAlert,
    message,
    handleSubmit,
    onSubmit,
    register,
    errors,
  };
};

export default useUserLogic;