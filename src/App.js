import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './Screens/Register.jsx';
import Login from './Screens/Login.js';
import './Styles/Register.css';
import './Login.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;