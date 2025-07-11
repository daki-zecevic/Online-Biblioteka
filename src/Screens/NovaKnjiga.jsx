import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/NovaKnjiga.css';

const TABS = [
  { key: 'osnovni', label: 'Osnovni Detalji' },
  { key: 'specifikacija', label: 'Specifikacija' },
  { key: 'multimedia', label: 'Multimedia' },
];

const initialForm = {
  naziv: '',
  opis: '',
  kategorija: '',
  zanr: '',
  autor: '',
  izdavac: '',
  godina: '',
  kolicina: '',
  brojStrana: '',
  vrstaPisma: '',
  vrstaPoveza: '',
  vrstaFormata: '',
  isbn: '',
  photo: null,
  multimedia: [],
};

const NovaKnjiga = () => {
  const [activeTab, setActiveTab] = useState('osnovni');
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, multimedia: Array.from(e.target.files) });
  };

  
  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'multimedia' && value.length) {
          value.forEach((file, idx) => data.append(`multimedia[${idx}]`, file));
        } else if (key === 'photo' && value) {
          data.append('photo', value);
        } else {
          data.append(key, value);
        }
      });

      const response = await fetch('https://biblioteka.simonovicp.com/api/books/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        toast.success('Knjiga uspješno dodata!');
        setTimeout(() => {
          navigate('dashboard/knjige');
        }, 1200);
      } else {
        toast.error('Greška pri dodavanju knjige.');
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nova-knjiga-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <h2>Novi Knjiga</h2>
      <p className="breadcrumbs">Evidencija knjiga / Nova knjiga</p>
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'tab-active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <form className="nova-knjiga-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {activeTab === 'osnovni' && (
          <div className="tab-content">
            <input
              type="text"
              name="naziv"
              placeholder="Unesite Naziv knjige.."
              value={formData.naziv}
              onChange={handleChange}
              required
            />
            <textarea
              name="opis"
              placeholder="Unesite kratak sadržaj knjige.."
              value={formData.opis}
              onChange={handleChange}
              rows={4}
            />
            <select name="kategorija" value={formData.kategorija} onChange={handleChange} required>
              <option value="">Izaberite kategoriju</option>
              <option value="Roman">Roman</option>
              <option value="Udžbenici">Udžbenici</option>
            
            </select>
            <select name="zanr" value={formData.zanr} onChange={handleChange}>
              <option value="">Izaberite žanr</option>
              <option value="Drama">Drama</option>
              <option value="Komedija">Komedija</option>
            
            </select>
            <select name="autor" value={formData.autor} onChange={handleChange}>
              <option value="">Izaberite autore</option>
              <option value="Ivo Andrić">Ivo Andrić</option>
              <option value="Mark Twain">Mark Twain</option>
            
            </select>
            <select name="izdavac" value={formData.izdavac} onChange={handleChange}>
              <option value="">Izaberite izdavača</option>
              <option value="Laguna">Laguna</option>
              <option value="Vulkan">Vulkan</option>
             
            </select>
            <input
              type="text"
              name="godina"
              placeholder="Unesite godinu izdavanja.."
              value={formData.godina}
              onChange={handleChange}
            />
            <input
              type="text"
              name="kolicina"
              placeholder="Unesite količinu.."
              value={formData.kolicina}
              onChange={handleChange}
            />
          </div>
        )}
        {activeTab === 'specifikacija' && (
          <div className="tab-content">
            <input
              type="text"
              name="brojStrana"
              placeholder="Unesite broj strana.."
              value={formData.brojStrana}
              onChange={handleChange}
            />
            <select name="vrstaPisma" value={formData.vrstaPisma} onChange={handleChange}>
              <option value="">Izaberite vrstu pisma</option>
              <option value="Ćirilica">Ćirilica</option>
              <option value="Latinica">Latinica</option>
            </select>
            <select name="vrstaPoveza" value={formData.vrstaPoveza} onChange={handleChange}>
              <option value="">Izaberite vrstu poveza</option>
              <option value="Tvrdi">Tvrdi</option>
              <option value="Meki">Meki</option>
            </select>
            <select name="vrstaFormata" value={formData.vrstaFormata} onChange={handleChange}>
              <option value="">Izaberite vrstu formata</option>
              <option value="A4">A4</option>
              <option value="B5">B5</option>
            
            </select>
            <input
              type="text"
              name="isbn"
              placeholder="Unesite ISBN.."
              value={formData.isbn}
              onChange={handleChange}
            />
            <small>International Standard Book Number</small>
          </div>
        )}
        {activeTab === 'multimedia' && (
          <div className="tab-content">
            <div className="multimedia-upload">
              <label htmlFor="photo" className="photo-label">
                <span role="img" aria-label="photo" style={{ fontSize: '30px' }}>🖼️</span>
                <span>Dodaj naslovnu fotografiju</span>
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              {formData.photo && (
                <div className="photo-preview">
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Preview"
                    style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                  />
                </div>
              )}
            </div>
            <div className="multimedia-upload">
              <label htmlFor="multimedia" className="photo-label">
                <span>Drag your files here or click in this area.</span>
              </label>
              <input
                type="file"
                id="multimedia"
                name="multimedia"
                multiple
                accept="image/*,video/*,audio/*"
                style={{ display: 'block', marginTop: '10px' }}
                onChange={handleFileChange}
              />
              {formData.multimedia.length > 0 && (
                <div className="multimedia-preview">
                  {formData.multimedia.map((file, idx) => (
                    <span key={idx} style={{ fontSize: '0.95em', marginRight: '8px' }}>{file.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="form-buttons">
          <button type="submit" className="sacuvaj-btn">✓ SAČUVAJ</button>
          <button type="button" className="ponisti-btn" onClick={() => navigate('/knjige')}>✗ PONIŠTI</button>
        </div>
      </form>
    </div>
  );
};

export default NovaKnjiga;