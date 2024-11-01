import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
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
                <Login />
          )}
          />  
          <Route
              path="/register"
              element={(
                <Register />
          )}
          />
          <Route
              path="/menu"
              element={(
                <Menu 
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
