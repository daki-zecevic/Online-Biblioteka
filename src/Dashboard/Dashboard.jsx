import React, { useState } from 'react';
import Sidebar from './komponente/Sidebar.jsx';
import NavBar from './komponente/NavBar.jsx';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <NavBar />
      <div className="dashboard-content">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;