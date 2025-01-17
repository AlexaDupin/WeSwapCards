import React, { useState, useEffect } from 'react';
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
// import { SignedIn, SignedOut, SignInButton } from '@clerk/react-router'

import Header from './components/Header/Header';
import SignInPage from './components/Login/SignInPage';
import SignUpPage from './components/Register/SignUpPage';
import LoginRedirect from './components/Login/LoginRedirect/LoginRedirect';
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
import Account from './components/Account/Account';
import PrivacyPolicy from './components/Legal/PrivacyPolicy/PrivacyPolicy';
import Terms from './components/Legal/Terms/Terms';
import Contact from './components/Legal/Contact/Contact';
import Legal from './components/Legal/Legal';
import Wrapper from './components/Wrapper/Wrapper';

import pageContainer from './components/PageContainer/pageContainer';

import {
  Spinner
} from "react-bootstrap";

import usePersistState from './hooks/usePersistState';
import useToken from './hooks/useToken';
import axios from 'axios';

import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';

function App() {
  const { isLoaded, user } = useUser();

  const [userUID, setUserUID] = useState('');
  // const [user, setUser] = useState('');
  // const [session, setSession] = useState('');

  // console.log('APP user', user);
  // console.log('APP session', session);

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
  const baseUrl = process.env.REACT_APP_BASE_URL;

console.log("APP userUID", userUID);
console.log("APP name", name);
console.log("APP token", token);

console.log("APP explorerId", explorerId);
console.log("isLogged", isLogged);
console.log("APP swapExplorerId", swapExplorerId);
console.log("APP conversationId", conversationId);


if (!isLoaded) {
  return <div className="loading">
    <Header
        setName={setName}
        setIsLogged={setIsLogged}
    />
    <Spinner
          animation="border"
          className="spinner" />
    </div>;


}

  return (
    <div className="App">
      <Header 
        setName={setName}
        setIsLogged={setIsLogged}
      />
      
      {/* <header className="flex items-center justify-center py-8 px-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ header> */}
      <Routes>
          <Route
              path="/"
              element={(<Home/>)}
          />   
          <Route
              path="/login"
              element={(
                <SignInPage />
              )}
          />            
          <Route
              path="/login/redirect"
              element={(
                <LoginRedirect 
                  setName={setName}
                  setExplorerId={setExplorerId}
                />
          )}
          />  
          <Route
              path="/register"
              element={(
                <SignUpPage />
              )}
          />
          <Route
              path="/register/user"
              element={(
                <User
                  setUserUID={setUserUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
                />
              )}
          />
          <Route
              path="/menu"
              element={
                <Menu 
                  name={name}
                  explorerId={explorerId}
                />
              }
          />
          <Route
              path="/report"
              title="Report my cards"
              element={
                <Report 
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              }
          />
          <Route
              path="/swap/card"
              element={
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
              }
          />
          <Route
              path="/swap/card/chat"
              element={
                <Chat
                  token={token}
                  explorerId={explorerId}
                  swapExplorerId={swapExplorerId}
                  swapCardName={swapCardName}
                  swapExplorerName={swapExplorerName}
                  setConversationId={setConversationId}
                  conversationId={conversationId}
                />
              }
          />
          <Route
              path="/swap/requests"
              element={
                <Requests
                  token={token}
                  name={name}
                  explorerId={explorerId}
                  setSwapCardName={setSwapCardName}
                  setSwapExplorerId={setSwapExplorerId}
                  setSwapExplorerName={setSwapExplorerName}
                  setConversationId={setConversationId}
                />
              }
          />
          <Route
              path="/swap/opportunities"
              element={
                <Opportunities
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              }
          />
          <Route
              path="/check"
              element={
                <CheckPage
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              }
          />
          {/* <Route
              path="/account"
              element={isLogged && name ? (
                <Account
                  user={user}
                  name={name}
                  token={token}
                />
              ) : <Navigate replace to="/login" />}
          /> */}
          <Route
              path="*"
              element={<NotFound />}
          />
          <Route
              path="/privacy"
              element={<PrivacyPolicy />}
          />
          <Route
              path="/terms"
              element={<Terms />}
          />
          <Route
              path="/contact"
              element={<Contact />}
          />
          <Route
              path="/legal"
              element={<Legal />}
          />                           
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
