import React from 'react';
import Sidebar from './komponente/Sidebar.jsx';
import NavBar from './komponente/NavBar.jsx';
import { Outlet } from 'react-router';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <NavBar />
        <Outlet /> {}
      </div>
    </div>
  );
};

export default Dashboard;
