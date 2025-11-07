import React, { useEffect, useState, useMemo, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { DispatchContext } from "../../../contexts/DispatchContext";
import { StateContext } from "../../../contexts/StateContext";

const PUBLIC_ALLOWLIST = new Set([
  '/', '/home', '/privacy', '/terms', '/cookies',
  '/contact', '/legal', '/login', '/login/redirect', '/register', '/register/user'
]);

export default function RequireUsername({ children }) {
  const location = useLocation();
  const path = location.pathname;
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hasExplorer = Boolean(state?.explorer?.id);
  const isPublic = useMemo(() => PUBLIC_ALLOWLIST.has(path), [path]);

  const [status, setStatus] = useState('ok');

  useEffect(() => {
    if (isPublic || !isSignedIn) {
      setStatus('ok');
      return;
    }

    if (hasExplorer) {
      setStatus('ok');
      return;
    }

    let active = true;
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
  }, [isPublic, isSignedIn, hasExplorer, getToken, user?.id, dispatch]);

  if (isPublic) return <>{children}</>;
  if (!isSignedIn) return <>{children}</>;

  if (status === 'checking') return <>{children}</>;

  if (status === 'missing') {
    const rawFrom = path + location.search + (location.hash || '');
    const from = path === '/register/user' ? '/menu' : rawFrom;
    return <Navigate to="/register/user" replace state={{ from }} />;
  }

  return <>{children}</>;
}