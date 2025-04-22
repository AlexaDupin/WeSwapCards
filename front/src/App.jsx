import React, { useEffect } from 'react';
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
import Report from './components/Report/ui/Report';
import SwapCard from './components/Swap/ui/SwapCard';
import Chat from './components/Chat/Chat';
import CheckPage from './components/CheckPage/ui/CheckPage';
import Dashboard from './components/Dashboard/ui/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';
import PrivacyPolicy from './components/Legal/PrivacyPolicy/PrivacyPolicy';
import Terms from './components/Legal/Terms/Terms';
import CookiePolicy from './components/Legal/CookiePolicy/CookiePolicy';
import Contact from './components/Legal/Contact/Contact';
import Legal from './components/Legal/Legal';

import pageContainer from './components/PageContainer/pageContainer';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';
// import { useStateContext } from './contexts/StateContext';

function App() {  
  // const state = useStateContext();
  // console.log('state', state);

  const { isLoaded } = useUser();
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchToken = async () => {
       const token = await getToken()
      //  console.log("APP TOKEN", token);
    }
    fetchToken();
  }, []);

if (!isLoaded) {
  return <div className="loading">
    <Header />
    <Spinner
          animation="border"
          className="spinner" />
    </div>;
}

  return (
    <div className="App">
      <Header />
      <Routes>
          <Route
              path="/"
              element={( <Home/> )}
          />   
          <Route
              path="/login"
              element={( <SignInPage /> )}
          />            
          <Route
              path="/login/redirect"
              element={( <LoginRedirect /> )}
          />  
          <Route
              path="/register"
              element={( <SignUpPage /> )}
          />
          <Route
              path="/register/user"
              element={( <User /> )}
          />
          
          <Route
              path="/menu"
              element={<ProtectedRoute 
                element={ <Menu /> } 
              />}
          />
          <Route
              path="/report"
              element={<ProtectedRoute 
                element={ <Report />} 
              />}
          />
          <Route
              path="/swap/card"
              element={<ProtectedRoute 
                element={ <SwapCard />} 
              />}
          />
          <Route
              path="/swap/card/chat"
              element={<ProtectedRoute 
                element={ <Chat />} 
              />}
            />
          <Route
              path="/swap/dashboard"
              element={<ProtectedRoute 
                element={
                  <Dashboard />} 
                />}
          />
          <Route
              path="/check"
              element={<ProtectedRoute 
                element={
                  <CheckPage />} 
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
  );
}

export default App;
