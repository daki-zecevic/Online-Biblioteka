import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/UcenikDetails.css';

const BibliotekarDetalji = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bibliotekar, setBibliotekar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState(null);

  useEffect(() => {
    const fetchBibliotekar = async () => {
      try {
        const res = await fetch(`https://library-api-k5b6.onrender.com/users/${id}`);
        if (!res.ok) throw new Error('Nije pronađen bibliotekar');
        const data = await res.json();
        setBibliotekar(data);
      } catch (err) {
        console.error(err);
        setGreska(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBibliotekar();
  }, [id]);

  if (loading) return <div>Učitavanje...</div>;
  if (greska) return <div>Greška: {greska}</div>;
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
