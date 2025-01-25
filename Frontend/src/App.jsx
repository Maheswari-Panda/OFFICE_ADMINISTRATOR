import './App.css'
import { Button } from 'react-daisyui'
import Login from './Pages/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Footer from './components/Footer';
import UserAuth from './context/user/UserAuth';
import Dashboard from './Pages/Dashboard';

import userContext from "../src/context/user/userContext";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';

function App() {
  const context = useContext(userContext);
  const {user}=context;
  return (
    <>
    <Router>
      <Routes>
      <Route
      path="/"
      element={user === null ? <Login /> : <Navigate to="/dashboard" />}
    />
    
    {/* Redirect to Login if the user is not logged in */}
    <Route
      path="/dashboard"
      element={user !== null ? <Dashboard /> : <Navigate to="/" />}
    />
      </Routes>
    </Router>
    </>
  )
}

export default App
