import React, { useEffect, useState, useRef } from 'react';
import '../Styles/Bibliotekari.css';
import { useNavigate } from 'react-router';
import BibliotekarMeni from '../Dashboard/komponente/BibliotekarMeni';

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
  const [bibliotekari, setBibliotekari] = useState([]);
  const [openMeniId, setOpenMeniId] = useState(null);
  const meniRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (meniRef.current && !meniRef.current.contains(e.target)) {
        setOpenMeniId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const formatted = localData.map((b, index) => ({
      id: dummyData.length + index + 1,
      name: `${b.ime} ${b.prezime}`,
      email: b.email,
      type: 'Bibliotekar',
      lastAccess: 'Nije se nikad ulogovao',
      avatar: b.slika || 'https://i.pravatar.cc/40?u=' + (dummyData.length + index + 1)
    }));
    setBibliotekari([...dummyData, ...formatted]);
  }, []);

  const obrisiBibliotekara = (id) => {
    const novi = bibliotekari.filter((b) => b.id !== id);
    setBibliotekari(novi);

    const originalni = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const noviLokalni = originalni.filter((_, index) => dummyData.length + index + 1 !== id);
    localStorage.setItem('bibliotekari', JSON.stringify(noviLokalni));
  };

  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">
        <button  className="add-btn-U" onClick={() => navigate('/dashboard/bibliotekari/n')}>
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
          {bibliotekari.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td><input type="checkbox" /></td>
                <td className="name-cell">
                  <img src={user.avatar} alt={user.name} className="avatar" />
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>{user.lastAccess}</td>
                <td style={{ position: 'relative' }}>
                  <button
                    className="menu-dots"
                    onClick={() =>
                      setOpenMeniId((prev) => (prev === user.id ? null : user.id))
                    }
                  >
                    ⋮
                  </button>
                  {openMeniId === user.id && (
                    <div ref={meniRef} className="menu-wrapper">
                      <BibliotekarMeni
                        id={user.id}
                        onClose={() => setOpenMeniId(null)}
                        onBrisi={obrisiBibliotekara}
                      />
                    </div>
                  )}
                </td>
              </tr>
            </React.Fragment>
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
