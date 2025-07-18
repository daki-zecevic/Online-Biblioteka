import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/BibliotekariDetalji.css';

const BibliotekarDetalji = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bibliotekar, setBibliotekar] = useState(null);

  useEffect(() => {
    const fetchBibliotekar = async () => {
      try {
        const response = await fetch(`https://library-api-k5b6.onrender.com/users/${id}`);
        if (!response.ok) throw new Error('Greška prilikom dohvatanja podataka.');
        const data = await response.json();
        setBibliotekar(data);
      } catch (error) {
        console.error(error);
        alert('Nije moguće učitati detalje bibliotekara.');
      }
    };

    fetchBibliotekar();
  }, [id]);

  if (!bibliotekar) {
    return <div>Učitavanje podataka...</div>;
  }

  return (
    <div className="detalji-container">
      <h2>Detalji o Bibliotekaru</h2>
      <div className="detalji-kartica">
        <div className="detalji-red">
          <span>Ime:</span>
          <span>{bibliotekar.ime}</span>
        </div>
        <div className="detalji-red">
          <span>Prezime:</span>
          <span>{bibliotekar.prezime}</span>
        </div>
        <div className="detalji-red">
          <span>JMBG:</span>
          <span>{bibliotekar.jmbg}</span>
        </div>
        <div className="detalji-red">
          <span>Email:</span>
          <span>{bibliotekar.email}</span>
        </div>
        <div className="detalji-red">
          <span>Korisničko ime:</span>
          <span>{bibliotekar.korisnickoIme}</span>
        </div>
        <div className="detalji-red">
          <span>Uloga:</span>
          <span>{bibliotekar.uloga}</span>
        </div>
        <div className="detalji-red">
          <span>Kreiran:</span>
          <span>{new Date(bibliotekar.createdAt).toLocaleString()}</span>
        </div>
        <div className="detalji-red">
          <span>Status prijave:</span>
          <span>
            {bibliotekar.lastLogin
              ? new Date(bibliotekar.lastLogin).toLocaleString()
              : 'Nije se nikad ulogovao'}
          </span>
        </div>
      </div>

      <button className="nazad-btn" onClick={() => navigate(-1)}>← Nazad</button>
    </div>
  );
};

export default BibliotekarDetalji;
