import React, { useState } from 'react';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import User from './components/Register/User/User';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';

import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';

function App() {
  const [userUID, setUserUID] = useState('');
  const [name, setName] = useState('');

  console.log("APP userUID", userUID);
  console.log("APP name", name);

  return (
    <div className="App">
      <Header 
        title="WeSwapCards"
      />
      <Routes>
          <Route
              path="/"
              element={(
              <Navigate replace to="/login"/>
          )}
          />   
          <Route
              path="/login"
              element={(
                <Login />
          )}
          />  
          <Route
              path="/register"
              element={(
                <Register 
                  setUserUID={setUserUID}
                />
          )}
          />
          <Route
              path="/register/user"
              element={(
                <User 
                  userUID={userUID}
                  setName={setName}
                />
          )}
          />
          <Route
              path="/menu"
              element={(
                <Menu 
                  name={name}
                />
          )}
          />
          <Route
              path="/report"
              element={(
                <Report 
                />
          )}
          />           
      </Routes>
    </div>
  );
}

export default App;
