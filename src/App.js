import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './Screens/Register.jsx';
import Login from './Screens/Login.js';
import Dashboard from './Dashboard/Dashboard.jsx';
import Bibliotekari from './Screens/Bibliotekari.jsx';
import DashboardContent from './Dashboard/DashboardContent.jsx'; 
import './Styles/Register.css';
import './Login.css';
import './Styles/fonts.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContent />} /> {}
          <Route path="bibliotekari" element={<Bibliotekari />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
