import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Shorten from './shorten.jsx';
import Analytics from './Analytics.jsx';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Shorten />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:shortCode"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);