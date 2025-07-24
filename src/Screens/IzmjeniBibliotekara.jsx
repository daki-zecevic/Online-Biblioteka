import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const IzmijeniBibliotekara = () => {
  const { id } = useParams(); // uzmi id iz URL-a
  const navigate = useNavigate();
  const [bibliotekar, setBibliotekar] = useState(null);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    slika: ''
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const found = data.find((b) => String(b.id) === String(id));
    if (found) {
      setBibliotekar(found);
      setFormData(found);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('bibliotekari')) || [];
    const updated = data.map((b) =>
      String(b.id) === String(id) ? { ...b, ...formData } : b
    );
    localStorage.setItem('bibliotekari', JSON.stringify(updated));
    navigate('/dashboard/bibliotekari');
  };

  if (!bibliotekar) {
    return <p style={{ padding: '20px', color: 'red' }}>Bibliotekar nije pronađen.</p>;
  }

  return (
    <div style={{ padding: '40px' }}>
      <h2>Izmijeni bibliotekara</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ime"
          value={formData.ime}
          onChange={handleChange}
          placeholder="Ime"
          required
        />
        <input
          type="text"
          name="prezime"
          value={formData.prezime}
          onChange={handleChange}
          placeholder="Prezime"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="slika"
          value={formData.slika}
          onChange={handleChange}
          placeholder="URL slike (nije obavezno)"
        />
        <button type="submit">Sačuvaj izmjene</button>
      </form>
    </div>
  );
};

export default IzmijeniBibliotekara;
