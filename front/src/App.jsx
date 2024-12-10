import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import User from './components/Register/User/User';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';
import Swap from './components/Swap/Swap';
import SwapCard from './components/Swap/SwapCard/SwapCard';
import Chat from './components/Chat/Chat';
import Opportunities from './components/Swap/Opportunities/Opportunities';
import CheckPage from './components/CheckPage/CheckPage';
import Requests from './components/Requests/Requests';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';

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
  const [name, setName] = usePersistState('', 'name');
  const [explorerId, setExplorerId] = usePersistState('', 'explorerId');
  // Hook created to manage token
  const { token, setToken } = useToken();
  const isLogged = token !== null;
  // Swap feature
  const [swapExplorerId, setSwapExplorerId] = useState('');
  const [swapCardName, setSwapCardName] = useState();
  const [swapExplorerName, setSwapExplorerName] = useState();
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    setName(name);
    setExplorerId(explorerId);
    setUserUID(userUID)
}, []);

console.log("APP userUID", userUID);
console.log("APP name", name);
console.log("APP explorerId", explorerId);
console.log("isLogged", isLogged);
console.log("APP swapExplorerId", swapExplorerId);
console.log("APP conversationId", conversationId);

  return (
    <div className="App">
      <Header 
        swapCardName={swapCardName}
        swapExplorerName={swapExplorerName}
      />
      <Routes>
          <Route
              path="/"
              element={isLogged && name ? (
                <Menu 
                  name={name}
                  explorerId={explorerId}
                  setName={setName}
                  setExplorerId={setExplorerId}
                />
              ) : <Navigate replace to="/login" />}
          />   
          <Route
              path="/login"
              element={(
                <Login 
                  setUserUID={setUserUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
                  setToken={setToken}
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
                  setToken={setToken}
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
              element={isLogged && name ? (
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
              path="/swap"
              element={isLogged && name ? (
                <Swap
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
      <Footer />
    </div>
  );
}

export default App;
