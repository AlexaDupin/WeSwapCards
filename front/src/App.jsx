import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from "react-bootstrap";
import { useUser, useAuth } from "@clerk/clerk-react";

import Header from './components/Header/Header';
import SignInPage from './components/Login/SignInPage';
import SignUpPage from './components/Register/SignUpPage';
import LoginRedirect from './components/Login/LoginRedirect/LoginRedirect';
import User from './components/Register/User/User';
import Home from './components/Home/Home';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';
import SwapCard from './components/Swap/SwapCard/SwapCard';
import Chat from './components/Chat/Chat';
import Opportunities from './components/Swap/Opportunities/Opportunities';
import CheckPage from './components/CheckPage/CheckPage';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';
// import CustomProfile from './components/CustomProfile/CustomProfile';

import PrivacyPolicy from './components/Legal/PrivacyPolicy/PrivacyPolicy';
import Terms from './components/Legal/Terms/Terms';
import CookiePolicy from './components/Legal/CookiePolicy/CookiePolicy';
import Contact from './components/Legal/Contact/Contact';
import Legal from './components/Legal/Legal';

import pageContainer from './components/PageContainer/pageContainer';
import usePersistState from './hooks/usePersistState';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';

function App() {
  const { isLoaded } = useUser();
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchToken = async () => {
       const token = await getToken()
      //  console.log("APP TOKEN", token);
    }
    fetchToken();
  }, []);

  const [userUID, setUserUID] = useState('');
  const [name, setName] = usePersistState('', 'name');
  const [explorerId, setExplorerId] = usePersistState('', 'explorerId');

  // Swap feature
  const [swapExplorerId, setSwapExplorerId] = useState('');
  const [swapCardName, setSwapCardName] = useState();
  const [swapExplorerName, setSwapExplorerName] = useState();
  const [swapExplorerOpportunities, setSwapExplorerOpportunities] = useState([]);
  const [conversationId, setConversationId] = useState('');

  // console.log("APP userUID", userUID);
  // console.log("APP name", name);
  // console.log("APP explorerId", explorerId);
  // console.log("APP swapExplorerId", swapExplorerId);
  // console.log("APP conversationId", conversationId);

if (!isLoaded) {
  return <div className="loading">
    <Header />
    <Spinner
          animation="border"
          className="spinner" />
    </div>;
}

  return (
    // <TokenProvider>
    <div className="App">
      <Header />
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
              element={<ProtectedRoute 
                element={
                <Menu 
                  name={name} 
                  explorerId={explorerId} 
                />} 
              />}
          />
          <Route
              path="/report"
              element={<ProtectedRoute 
                element={
                  <Report 
                    name={name}
                    explorerId={explorerId}
                  />} 
              />}
          />
          <Route
              path="/swap/card"
              element={<ProtectedRoute 
                element={
                  <SwapCard
                    name={name}
                    explorerId={explorerId}
                    setSwapExplorerId={setSwapExplorerId}
                    swapCardName={swapCardName}
                    setSwapCardName={setSwapCardName}
                    setSwapExplorerName={setSwapExplorerName}
                    setConversationId={setConversationId}
                    setSwapExplorerOpportunities={setSwapExplorerOpportunities}
                  />} 
                />}
          />
          <Route
              path="/swap/card/chat"
              element={<ProtectedRoute 
                element={
                  <Chat
                    explorerId={explorerId}
                    swapExplorerId={swapExplorerId}
                    swapCardName={swapCardName}
                    swapExplorerName={swapExplorerName}
                    setConversationId={setConversationId}
                    conversationId={conversationId}
                    swapExplorerOpportunities={swapExplorerOpportunities}
                  />} 
                />}
            />
          <Route
              path="/swap/dashboard"
              element={<ProtectedRoute 
                element={
                  <Dashboard
                    explorerId={explorerId}
                    setSwapCardName={setSwapCardName}
                    setSwapExplorerId={setSwapExplorerId}
                    setSwapExplorerName={setSwapExplorerName}
                    setConversationId={setConversationId}
                    setSwapExplorerOpportunities={setSwapExplorerOpportunities}
                  />} 
                />}
          />
          <Route
              path="/swap/opportunities"
              element={<ProtectedRoute 
                element={
                  <Opportunities
                    name={name}
                    explorerId={explorerId}
                />} 
              />}
          />
          <Route
              path="/check"
              element={<ProtectedRoute 
                element={
                  <CheckPage
                    name={name}
                    explorerId={explorerId}
                />} 
              />}
          />
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
              path="/cookies"
              element={<CookiePolicy />}
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
    // </TokenProvider>
  );
}

export default App;
