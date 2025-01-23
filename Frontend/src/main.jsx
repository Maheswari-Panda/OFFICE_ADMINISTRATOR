import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserAuth from './context/user/UserAuth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuth>
    <App />
    </UserAuth>
  </StrictMode>,
)
