import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import User from './components/Register/User/User';
import Menu from './components/Menu/Menu';
import Report from './components/Report/Report';
import Opportunities from './components/Opportunities/Opportunities';
import CheckPage from './components/CheckPage/CheckPage';

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

  useEffect(() => {
    setName(name);
    setExplorerId(explorerId);
    setUserUID(userUID)
}, []);

console.log("APP userUID", userUID);
console.log("APP name", name);
console.log("APP explorerId", explorerId);
console.log("isLogged", isLogged);

  return (
    <div className="App">
      <Header />
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
              element={isLogged ? (
                <Menu 
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/report"
              title="Report my cards"
              element={isLogged ? (
                <Report 
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/opportunities"
              element={isLogged ? (
                <Opportunities
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />
          <Route
              path="/check"
              element={isLogged ? (
                <CheckPage
                  token={token}
                  name={name}
                  explorerId={explorerId}
                />
              ) : <Navigate replace to="/login" />}
          />                 
      </Routes>
    </div>
  );
}

export default App;
