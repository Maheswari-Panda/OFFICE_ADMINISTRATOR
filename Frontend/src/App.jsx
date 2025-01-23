import './App.css'
import { Button } from 'react-daisyui'
import Login from './Pages/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route
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
        <Route exact path="/" element={user===null && <Login/>}/>
        <Route exact path="/dashboard" element={user && <Dashboard/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
