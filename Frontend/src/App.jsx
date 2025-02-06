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
import Dashboard from './pages/Dashboard';

import userContext from "../src/context/user/userContext";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import DocumentViewer from './components/DocumentViewer';
import DocumentPreview from './components/DocumentPreview';

function App() {
  const context = useContext(userContext);
  const {user}=context;
  return (
    <>
    {/* <DocumentPreview/> */}
    {/* <Sidebar/> */}
    <Router>
      <Routes>
      <Route exactpath="/dashboard/content" element={<Sidebar />} />
      <Route
      exact path="/"
      element={user === null ? <Login /> : <Navigate to="/dashboard" />}
    />
    
    {/* Redirect to Login if the user is not logged in */}
    <Route
      exact path="/dashboard/*"
      element={user !== null ? <Dashboard /> : <Navigate to="/" />}
    />
      </Routes>
    </Router>
    </>
  )
}

export default App
