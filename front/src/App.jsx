import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import User from './components/Register/User/User';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';
import SwapCard from './components/Swap/SwapCard/SwapCard';
import Chat from './components/Chat/Chat';
import Opportunities from './components/Swap/Opportunities/Opportunities';
import CheckPage from './components/CheckPage/CheckPage';
import Requests from './components/Requests/Requests';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';
import pageContainer from './components/PageContainer/pageContainer';

import {
  Spinner
} from "react-bootstrap";

import usePersistState from './hooks/usePersistState';
import useToken from './hooks/useToken';

import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';

function App() {
  const [userUID, setUserUID] = useState('');
  const [user, setUser] = useState('');
  const [session, setSession] = useState('');

  console.log('APP user', user);
  console.log('APP session', session);

  const [name, setName] = usePersistState('', 'name');
  const [explorerId, setExplorerId] = usePersistState('', 'explorerId');
  // Hook created to manage token
  const { token, setToken } = useToken();
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);  // Track loading state to prevent route redirects

  // Swap feature
  const [swapExplorerId, setSwapExplorerId] = useState('');
  const [swapCardName, setSwapCardName] = useState();
  const [swapExplorerName, setSwapExplorerName] = useState();
  const [conversationId, setConversationId] = useState('');

console.log("APP userUID", userUID);
console.log("APP name", name);
console.log("APP token", token);

console.log("APP explorerId", explorerId);
console.log("isLogged", isLogged);
console.log("APP swapExplorerId", swapExplorerId);
console.log("APP conversationId", conversationId);

useEffect(() => {
  // Try to get session from localStorage
  console.log('STORING SESSION');
  const storedSession = localStorage.getItem('supabase_session');
  const storedUser = localStorage.getItem('user');

  if (storedSession && storedUser) {
    const parsedSession = JSON.parse(storedSession);
    const parsedUser = JSON.parse(storedUser);
    setSession(parsedSession);
    setUser(parsedUser);
    setIsLogged(true);
  }

  setLoading(false);

}, []);

useEffect(() => {
  // If there is a session, check if it's expired and update state accordingly
  if (token) {
      setIsLogged(true); 
  }
}, [session]);

// Function to retrieve session from localStorage
const getSessionFromLocalStorage = () => {
  console.log("getSessionFromLocalStorage");
  const storedSession = localStorage.getItem('supabase_session');
  console.log("storedSession", JSON.parse(storedSession));
  if (storedSession) {
    return JSON.parse(storedSession);
  }
  return null;
};

useEffect(() => {
  // Call session refresh if token is expired or on first load
  if (!session || isSessionExpired(session)) {
    getSessionFromLocalStorage();  // Try to refresh session if expired
  }

}, []);

// Function to check if the session is expired
const isSessionExpired = (session) => {
  const currentTime = Date.now() / 1000; // Get current time in seconds
  const expirationTime = session.expires_at;
  return expirationTime < currentTime; // Returns true if the session has expired
};

if (loading) {
  return <div className="loading">
    <Header
        setName={setName}
    />
    <Spinner
          animation="border"
          className="spinner" />
    </div>;
}

  return (
    <div className="App">
      <Header 
        swapCardName={swapCardName}
        swapExplorerName={swapExplorerName}
        setName={setName}
      />
      <Routes>
          <Route
              path="/"
              element={(<Home/>)}
          />   
          <Route
              path="/login"
              element={(
                <Login 
                  setUserUID={setUserUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
                  setToken={setToken}
                  setUser={setUser}
                  setSession={setSession}
                  setIsLogged={setIsLogged}
                />
              )}
          />  
          <Route
              path="/register"
              element={(
                <Register 
                  setUserUID={setUserUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
                  // setToken={setToken}
                />
              )}
          />
          <Route
              path="/register/user"
              element={(
                <User
                  userUID={userUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
                  token={token}
                />
              )}
          />
          <Route
              path="/menu"
              element={isLogged ? (
                <Menu 
                  name={name}
                  explorerId={explorerId}
                  setName={setName}
                  setExplorerId={setExplorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/report"
              title="Report my cards"
              element={isLogged && name ? (
                <Report 
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/swap/card"
              element={isLogged && name ? (
                <SwapCard
                  token={token}
                  name={name}
                  explorerId={explorerId}
                  setSwapExplorerId={setSwapExplorerId}
                  swapCardName={swapCardName}
                  setSwapCardName={setSwapCardName}
                  setSwapExplorerName={setSwapExplorerName}
                  setConversationId={setConversationId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/swap/card/chat"
              element={isLogged && name ? (
                <Chat
                  token={token}
                  explorerId={explorerId}
                  swapExplorerId={swapExplorerId}
                  swapCardName={swapCardName}
                  swapExplorerName={swapExplorerName}
                  setConversationId={setConversationId}
                  conversationId={conversationId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/swap/requests"
              element={isLogged && name ? (
                <Requests
                  token={token}
                  name={name}
                  explorerId={explorerId}
                  setSwapCardName={setSwapCardName}
                  setSwapExplorerId={setSwapExplorerId}
                  setSwapExplorerName={setSwapExplorerName}
                  setConversationId={setConversationId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/swap/opportunities"
              element={isLogged && name ? (
                <Opportunities
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/check"
              element={isLogged && name ? (
                <CheckPage
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="*"
              element={<NotFound />}
          />                 
      </Routes>
      {isLogged && name ? (
      <Footer />
      ) : ''}
    </div>
  );
}

export default App;
