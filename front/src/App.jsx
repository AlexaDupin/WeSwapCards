import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import User from './components/User/User';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';
import usePersistState from './hooks/usePersistState';

import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";

import './styles/_reset.css';
import './styles/index.scss';

import './App.css';
import './App.scss';

function App() {
  const [userUID, setUserUID] = useState('');
  const [name, setName] = usePersistState('', 'name');
  const [explorerId, setExplorerId] = usePersistState('', 'explorerId');

  console.log("APP userUID", userUID);
  console.log("APP name", name);
  console.log("APP explorerId", explorerId);

  useEffect(() => {
    setName(name);
    setExplorerId(explorerId);
    setUserUID(userUID)
}, []);

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
                <Login 
                  setUserUID={setUserUID}
                  setName={setName}
                  setExplorerId={setExplorerId}
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
                />
          )}
          />
          <Route
              path="/menu"
              element={(
                <Menu 
                  name={name}
                  explorerId={explorerId}
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
