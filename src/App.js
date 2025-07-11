import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Screens/Register.jsx';
import Login from './Screens/Login.js';
import Dashboard from './Dashboard/Dashboard.jsx';
import Bibliotekari from './Screens/Bibliotekari.jsx';
import DashboardContent from './Dashboard/DashboardContent.jsx'; 
import DodajBibliotekara from './Screens/DodajBibliotekara.jsx';
import Ucenici from './Screens/Ucenici.jsx';
import DodavanjeUcenika from './Screens/DodavanjeUcenika.jsx';
import UcenikDetails from './Screens/UcenikDetails.jsx';
import Admin from './Screens/Admin.jsx';
import NoviAdmin from './Screens/NoviAdmin.jsx';
import AdminPrikaz from './Screens/AdminPrikaz.jsx';
import Knjige from './Screens/Knjige.jsx';
import NovaKnjiga from './Screens/NovaKnjiga.jsx';
import KnjigaPrikaz from './Screens/KnjigaPrikaz.jsx';
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

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContent />} />
          <Route path="bibliotekari" element={<Bibliotekari />} />
          <Route path="bibliotekari/n" element={<DodajBibliotekara />} />
          <Route path="ucenici" element={<Ucenici />} />
          <Route path="ucenici/novi" element={<DodavanjeUcenika />} /> 
          <Route path="ucenici/view/:id" element={<UcenikDetails />} /> 
          <Route path="admin" element={<Admin />} />
          <Route path="admin/n" element={<NoviAdmin />} />
          <Route path="admin/prikaz/:id" element={<AdminPrikaz />} />
          <Route path="knjige" element={<Knjige />} />
          <Route path="knjige/n" element={<NovaKnjiga />} />
          <Route path="knjige/prikaz/:id" element={<KnjigaPrikaz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
