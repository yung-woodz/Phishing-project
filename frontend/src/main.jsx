import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import CreateEmail from './pages/CreateEmail.jsx'
import LoginFake from './pages/LoginFake.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/enviar-email" replace />
  },
  {
    path: '/enviar-email',
    element: <CreateEmail />
  },
  {
    path: '/fake-login',
    element: <LoginFake />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
