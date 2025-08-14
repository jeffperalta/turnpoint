import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import ClientPage from './pages/client/ClientPage';
import { ToastContainer } from 'react-toastify';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateClientPage from './pages/client/CreateClientPage';
import UpdateClientPage from './pages/client/UpdateClientPage';
import LoginPage from './pages/login/LoginPage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="clients/create" element={<CreateClientPage />} />
          <Route path="clients/update/:id" element={<UpdateClientPage />} />
        </Route>
      </Routes>

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        closeOnClick
        hideProgressBar={true}
      />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
