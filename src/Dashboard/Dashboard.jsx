import React from 'react';
import Sidebar from './Sidebar';
import NavBar from './NavBar';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Books', value: 154, color: '#4e73df' },
    { title: 'Users', value: 93, color: '#1cc88a' },
    { title: 'Loans', value: 48, color: '#36b9cc' },
    { title: 'Returns', value: 33, color: '#f6c23e' }
  ]
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Books Loaned',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#4e73df'
      },
      {
        label: 'Books Returned',
        data: [8, 15, 5, 8, 3, 7],
        backgroundColor: '#1cc88a'
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <NavBar />
        <div className="dashboard-content">
          {/*st*/}
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Grafikoni */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Monthly Activity</h3>
              <div className="chart-wrapper">
                <div className="bar-chart">
                  {chartData.labels.map((label, i) => (
                    <div key={i} className="chart-group">
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar loaned" 
                          style={{ height: `${(chartData.datasets[0].data[i] / 20) * 100}%` }}
                        ></div>
                        <div 
                          className="chart-bar returned" 
                          style={{ height: `${(chartData.datasets[1].data[i] / 20) * 100}%` }}
                        ></div>
                      </div>
                      <div className="chart-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color loaned"></span>
                    <span>Loaned</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color returned"></span>
                    <span>Returned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;