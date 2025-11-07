import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";

import Header from './components/Header/Header';
import SignInPage from './components/Login/SignInPage';
import SignUpPage from './components/Register/SignUpPage';
import LoginRedirect from './components/Login/LoginRedirect/ui/LoginRedirect';
import User from './components/Register/User/ui/User';
import RequireUsername from './components/Register/RequireUsername/RequireUsername';
import Home from './components/Home/Home';

import Menu from './components/Menu/Menu';
import SwapCard from './components/Swap/ui/SwapCard';
import Chat from './components/Chat/ui/Chat';
import Dashboard from './components/Dashboard/ui/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';
import PrivacyPolicy from './components/Legal/PrivacyPolicy/PrivacyPolicy';
import Terms from './components/Legal/Terms/Terms';
import CookiePolicy from './components/Legal/CookiePolicy/CookiePolicy';
import Contact from './components/Legal/Contact/Contact';
import Legal from './components/Legal/Legal';
import Cards from './components/Cards/ui/Cards';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/_reset.css';
import './styles/index.scss';
import './App.scss';

function App() {  
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchToken = async () => { await getToken(); };
    fetchToken();
  }, [getToken]);

  return (
    <div className="App">
      <Header />

      <RequireUsername>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<SignInPage />} />
        <Route path="/login/redirect" element={<LoginRedirect />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/register/user" element={<User />} />

        <Route path="/menu" element={<Menu />} />
        <Route path="/swap/card" element={<SwapCard />} />
        <Route path="/swap/card/chat" element={<Chat />} />
        <Route path="/swap/dashboard" element={<Dashboard />} />
        <Route path="/cards" element={<Cards />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </RequireUsername>

      <Footer />
    </div>
  );
}

export default App;
