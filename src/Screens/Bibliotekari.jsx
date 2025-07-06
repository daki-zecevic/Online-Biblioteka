import React from 'react';
import '../Styles/Bibliotekari.css';
import { useNavigate } from 'react-router-dom';


const dummyData = [
  {
    id: 1,
    name: 'Valentina Kascelan',
    email: 'valentina.kascelan@domain.net',
    type: 'Bibliotekar',
    lastAccess: 'Prije 10 sati',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    name: 'Tarik Zaimovic',
    email: 'tarik.zaimovic@domain.net',
    type: 'Bibliotekar',
    lastAccess: 'Prije 2 dana',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 3,
    name: 'Test Akontacijevic',
    email: 'test.akontijevic@domain.net',
    type: 'Bibliotekar',
    lastAccess: 'Nije se nikad ulogovao',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
  {
    id: 4,
    name: 'Darko Kascelan',
    email: 'darko.kascelan@domain.net',
    type: 'Bibliotekar',
    lastAccess: 'Prije 2 nedelje',
    avatar: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 5,
    name: 'Marko Markovic',
    email: 'marko.markovic@domain.net',
    type: 'Bibliotekar',
    lastAccess: 'Prije 3 dana',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
];



const Bibliotekari = () => {
  const navigate = useNavigate();
  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">

        <button className="add-btn" onClick={() => navigate('/dashboard/bibliotekari/n')}>
          + NOVI BIBLIOTEKAR
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

export default Bibliotekari;
