import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/UcenikDetails.css';

const BibliotekarDetalji = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bibliotekar, setBibliotekar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        ime: 'Valentina',
        prezime: 'Kascelan',
        email: 'valentina.kascelan@domain.net',
        korisnickoIme: 'valentina',
        jmbg: '123456789',
        uloga: 'Bibliotekar',
        avatarUrl: 'https://i.pravatar.cc/40?img=1',
        createdAt: '2023-01-01T12:00:00',
        lastLogin: '2024-07-01T10:00:00'
      },
      {
        id: 2,
        ime: 'Tarik',
        prezime: 'Zaimovic',
        email: 'tarik.zaimovic@domain.net',
        korisnickoIme: 'tarikz',
        jmbg: '987654321',
        uloga: 'Bibliotekar',
        avatarUrl: 'https://i.pravatar.cc/40?img=2',
        createdAt: '2023-02-01T12:00:00',
        lastLogin: '2024-07-02T14:00:00'
      }
    ];

    const lokalni = JSON.parse(localStorage.getItem('bibliotekari')) || [];

    const dodatniFormatirani = lokalni.map((b, index) => ({
      ...b,
      id: dummyData.length + index + 1,
      avatarUrl: b.slika || 'https://i.pravatar.cc/40?u=random'
    }));

    const svi = [...dummyData, ...dodatniFormatirani];
    const nadjeni = svi.find(b => b.id === parseInt(id));
    setBibliotekar(nadjeni);
    setLoading(false);
  }, [id]);

  if (loading) return <div>Učitavanje...</div>;
  if (!bibliotekar) return <div>Bibliotekar nije pronađen</div>;

  return (
    <div className="no-scroll-container">
      <div className="container">
        <button onClick={() => navigate(-1)}>← Nazad</button>
        <h2>Detalji bibliotekara</h2>
        {bibliotekar.avatarUrl && <img src={bibliotekar.avatarUrl} alt={bibliotekar.ime} />}

        <div className="detail-row"><strong>Ime i prezime:</strong><div className="detail-value">{bibliotekar.ime} {bibliotekar.prezime}</div></div>
        <div className="detail-row"><strong>Email:</strong><div className="detail-value">{bibliotekar.email}</div></div>
        <div className="detail-row"><strong>Korisničko ime:</strong><div className="detail-value">{bibliotekar.korisnickoIme || bibliotekar.username}</div></div>
        <div className="detail-row"><strong>JMBG:</strong><div className="detail-value">{bibliotekar.jmbg || 'N/A'}</div></div>
        <div className="detail-row"><strong>Uloga:</strong><div className="detail-value">{bibliotekar.uloga}</div></div>
        {bibliotekar.createdAt && <div className="detail-row"><strong>Kreiran:</strong><div className="detail-value">{new Date(bibliotekar.createdAt).toLocaleString()}</div></div>}
        {bibliotekar.lastLogin && <div className="detail-row"><strong>Status prijave:</strong><div className="detail-value">{new Date(bibliotekar.lastLogin).toLocaleString()}</div></div>}
      </div>
    </div>
  );
};

export default BibliotekarDetalji;
