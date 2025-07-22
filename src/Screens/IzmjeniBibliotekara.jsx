import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const IzmijeniBibliotekara = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bibliotekar, setBibliotekar] = useState({
    ime: '',
    prezime: '',
    email: '',
    slika: '',
  });

  useEffect(() => {
    const lokalni = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const index = parseInt(id) - 6; // jer dummy ima id 1-5
    const b = lokalni[index];
    if (b) {
      setBibliotekar({ ...b });
    } else {
      alert("Bibliotekar nije pronađen.");
      navigate('/dashboard/bibliotekari');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setBibliotekar({ ...bibliotekar, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lokalni = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const index = parseInt(id) - 6;
    lokalni[index] = bibliotekar;
    localStorage.setItem('bibliotekari', JSON.stringify(lokalni));
    navigate('/dashboard/bibliotekari');
  };

  return (
    <div className="izmijeni-container">
      <h2>Izmijeni Bibliotekara</h2>
      <form onSubmit={handleSubmit} className="izmijeni-form">
        <input
          type="text"
          name="ime"
          placeholder="Ime"
          value={bibliotekar.ime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="prezime"
          placeholder="Prezime"
          value={bibliotekar.prezime}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={bibliotekar.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="slika"
          placeholder="URL slike (opcionalno)"
          value={bibliotekar.slika}
          onChange={handleChange}
        />
        <button type="submit">Sačuvaj Izmjene</button>
      </form>
    </div>
  );
};

export default IzmijeniBibliotekara;
