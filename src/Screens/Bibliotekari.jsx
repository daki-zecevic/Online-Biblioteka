import React, { useEffect, useState, useRef } from 'react';
import '../Styles/Bibliotekari.css';
import { useNavigate } from 'react-router';
import BibliotekarMeni from '../Dashboard/komponente/BibliotekarMeni';

const API_BASE = 'http://localhost:8000'; 

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
  const fetchBibliotekari = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Neuspješno dohvaćanje bibliotekara');
      }

      const data = await res.json();

      // Formatiraj podatke kako treba za prikaz
      const formatted = data.map((b, index) => ({
        id: b.id,
        name: `${b.name} ${b.last_name}`,
        email: b.email,
        type: 'Bibliotekar',
        lastAccess: b.last_login || 'Nije se nikad ulogovao',
        avatar: b.image || `https://i.pravatar.cc/40?u=${b.id}`
      }));

      setBibliotekari(formatted);
    } catch (err) {
      console.error('Greška pri dohvaćanju bibliotekara:', err);
    }
  };

  fetchBibliotekari();
}, []);


  const obrisiBibliotekara = (id) => {
    setBibliotekari(prev => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">
        <button className="add-btn-U" onClick={() => navigate('/dashboard/bibliotekari/n')}>
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
            <tr key={user.id}>
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
