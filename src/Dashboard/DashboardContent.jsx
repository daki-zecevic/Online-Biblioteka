import ivan from './slike/ivan.jpg';
import nenad from './slike/nenad.jpg';
import lazar from './slike/pele.jpg';
import jovan from './slike/jovan.jpg';
import janko from './slike/janko.jpg';
import nikola from './slike/nikola.webp';
import lazarl from './slike/lazarl.jpg';
import './DashboardContent.css';
  //MOJI DUMMY PODACI:)
const DashboardContent = () => {

  const users = [
    { id: 1, name: 'Janko Bojic', book: 'Na Drini ćuprija', status: 'returned', days: 0, img: janko},
    { id: 2, name: 'nikola Milickovic', book: 'Prokleta avlija', status: 'overdue', days: 3, img: nikola},
    { id: 3, name: 'Ivan Omerovic', book: 'Derviš i smrt', status: 'loaned', days: 5, img: ivan },
    { id: 4, name: 'Jovan Djurovic', book: 'Tvrđava', status: 'reserved', days: 2, img: jovan },
    { id: 5, name: 'Lazar Pesic', book: 'Konak', status: 'overdue', days: 7, img: lazar},
    { id: 6, name: 'Nenad Andric', book: 'Most na Žepi', status: 'loaned', days: 4, img: nenad },
    { id: 7, name: 'Lazar Lukovac', book: 'Gorski vijenac', status: 'reserved', days: 1, img: lazarl },
  ];

  const chartData = {
    labels: ['Rezervisane', 'Prekoračene', 'U posudi'],
    values: [24, 8, 32],
    colors: ['#F6C23E', '#E74A3B', '#1CC88A']
  };

  return (
    <div className="dashboard-content-container">

      <div className="dashboard-users-list">
        <h3>Trenutne situacije</h3>
        <div className="dashboard-user-cards">
          {users.map(user => (
            <div key={user.id} className="dashboard-user-card">
              <img src={user.img} alt={user.name} className="dashboard-user-avatar" />
              <div className="dashboard-user-info">
                <span className="dashboard-user-name">{user.name}</span>
                <span className="dashboard-book-title">{user.book}</span>
              </div>
              <div className={`dashboard-user-status ${user.status}`}>
                {user.status === 'returned' && 'Vraćeno'}
                {user.status === 'overdue' && `Kašnjenje +${user.days}d`}
                {user.status === 'loaned' && `Posuđeno (${user.days}d)`}
                {user.status === 'reserved' && 'Rezervisano'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-status-chart">
        <h3>Status knjiga</h3>
        <div className="dashboard-horizontal-bars">
          {chartData.labels.map((label, index) => (
            <div key={index} className="dashboard-bar-container">
              <span className="dashboard-bar-label">{label}</span>
              <div className="dashboard-bar-wrapper">
                <div 
                  className="dashboard-bar" 
                  style={{
                    width: `${chartData.values[index]}%`,
                    backgroundColor: chartData.colors[index]
                  }}
                ></div>
                <span className="dashboard-bar-value">{chartData.values[index]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;