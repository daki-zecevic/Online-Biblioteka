import React from 'react';
import '../Styles/Bibliotekari.css';
import { useNavigate } from 'react-router';


const dummyData = [
  {
    id: 1,
    name: 'Mika Milic',
    email: 'mika.milic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 10 sati',
    avatar: 'https://i.pravatar.cc/40?img=47',
  },
  {
    id: 2,
    name: 'Pero Perovic',
    email: 'pero.perovic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 2 dana',
    avatar: 'https://i.pravatar.cc/40?img=53',
  },
  {
    id: 3,
    name: 'Zaim Zaimovic',
    email: 'zaim.zaimovic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Nije se nikad ulogovao',
    avatar: 'https://i.pravatar.cc/40?img=58',
  },
  {
    id: 4,
    name: 'Nikola Nikolic',
    email: 'nikola.nikolic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 2 nedelje',
    avatar: 'https://i.pravatar.cc/40?img=52',
  },
  {
    id: 5,
    name: 'Marijana Marijanov',
    email: 'marijana.marijanov@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 3 dana',
    avatar: 'https://i.pravatar.cc/40?img=48',
  },
];



const Ucenici = () => {
  const navigate = useNavigate();
  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">

        <button className="add-btn" onClick={() => navigate('/dashboard/ucenici/novi')}>
          + NOVI UCENIK
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

export default Ucenici;
