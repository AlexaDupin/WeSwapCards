import React, { useEffect, useState, useMemo, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { DispatchContext } from "../../../contexts/DispatchContext";

const PUBLIC_ALLOWLIST = new Set([
  '/', '/home', '/privacy', '/terms', '/cookies',
  '/contact', '/legal', '/login', '/login/redirect', '/register', '/register/user'
]);

export default function RequireUsername({ children }) {
  const dispatch = useContext(DispatchContext);
  const location = useLocation();
  const path = location.pathname;
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const isPublic = useMemo(() => PUBLIC_ALLOWLIST.has(path), [path]);

  const [status, setStatus] = useState('ok');
  console.log("STATUS", status);

  useEffect(() => {
    let active = true;

    if (!isSignedIn || isPublic) {
      setStatus('ok');
      return () => {};
    }

    setStatus('checking');
    (async () => {
      try {
        const token = await getToken();
        const res = await axiosInstance.post(
          '/login/user',
          { userUID: user?.id },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        if (!active) return;

        const id   = res?.data?.id;
        const name = res?.data?.name || res?.data?.username;

        if (res.status === 200 && id && name) {
          dispatch({
            type: 'explorer/set',
            payload: { explorerId: String(id), explorerName: String(name) }
          });
          setStatus('ok');
        } else {
          setStatus('missing');
        }
      } catch {
        if (active) setStatus('missing');
      }
    })();

    return () => { active = false; };
  }, [isSignedIn, isPublic, user?.id, getToken, path, dispatch]);

  // Rendering rules AFTER hooks:
  // Public routes and signed-out users are never blocked.
  if (isPublic) return <>{children}</>;
  if (!isSignedIn) return <>{children}</>;

  if (status === 'checking') return null; // brief guard while verifying

  if (status === 'missing') {
    // never set "from" to /register/user — avoid echo loops
    const rawFrom = path + location.search + (location.hash || '');
    const from = path === '/register/user' ? '/menu' : rawFrom;

    return <Navigate to="/register/user" replace state={{ from }} />;
  }

  return <>{children}</>;
}