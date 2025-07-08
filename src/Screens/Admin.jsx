import React from 'react';
import '../Styles/Admin.css';
import { useNavigate } from 'react-router';


const dummyData = [
  {
    id: 1,
    name: 'Pavle Kosović',
    email: 'pavlekosovic@domain.net',
    type: 'Admin',
    lastAccess: 'Prije 10 sati',
    avatar: '../pavlekosovic.jpg',
  },
  
];



const Admin = () => {
  const navigate = useNavigate();
  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">

        <button className="add-btn" onClick={() => navigate('/dashboard/admin/n')}>
          + NOVI ADMIN
        </button>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <table className="bibliotekari-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Tip korisnika</th>
            <th>Zadnji pristup sistemu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((user) => (
            <tr key={user.id}>
              <td><input type="checkbox" /></td>
              <td className="name-cell">
                <img src={user.avatar} alt={user.name} className="avatar" />
                {user.name}
              </td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{user.lastAccess}</td>
              <td><span className="menu-dots">⋮</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>Rows per page: 20</span>
        <span>1 of 1</span>
        <span>{`< >`}</span>
      </div>
    </div>
  );
};

export default Admin;
