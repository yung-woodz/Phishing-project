import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginFake from './pages/LoginFake.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginFake />
  </StrictMode>,
)
