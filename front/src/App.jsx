import Header from './components/Header/Header';
import Login from './components/Login/Login';
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
      </Routes>
    </div>
  );
}

export default App;
