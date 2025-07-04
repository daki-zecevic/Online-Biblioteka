import React from 'react';
import Sidebar from './komponente/Sidebar.jsx';
import NavBar from './komponente/NavBar.jsx';
import DashboardContent from './DashboardContent';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <NavBar />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;