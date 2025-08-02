import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Styles/NovaKnjiga.css';

const TABS = [
  { key: 'osnovni', label: 'Osnovni Detalji' },
  { key: 'specifikacija', label: 'Specifikacija' },
  { key: 'multimedia', label: 'Multimedia' },
];

const NovaKnjiga = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nazivKnjiga: '',
    kratki_sadrzaj: '',
    categories: '',
    genres: '',
    authors: '',
    izdavac: '',
    godinaIzdavanja: '',
    knjigaKolicina: '',
    brStrana: '',
    pismo: '',
    povez: '',
    format: '',
    jezik: '',
    isbn: '',
    deletePdfs: 0
  });

  const [activeTab, setActiveTab] = useState('osnovni');
  const [errors, setErrors] = useState({});
  const [slika, setSlika] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
  const [pictures, setPictures] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleMultimediaClick = () => {
    document.getElementById('multimedia').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSlika(imageUrl);
      
      const newPicture = [imageUrl, true];
      setPictures(prev => {
        const withoutCover = prev.map(pic => [pic[0], false]);
        return [...withoutCover, newPicture];
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (['categories', 'genres', 'authors', 'izdavac', 'pismo', 'povez', 'format', 'jezik'].includes(name)) {
      processedValue = value ? parseInt(value) : '';
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    setMultimedia(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allErrors = {};
    
    if (!formData.nazivKnjiga.trim()) {
      allErrors.nazivKnjiga = 'Morate unijeti naziv knjige!';
    }

    if (!formData.categories) {
      allErrors.categories = 'Morate izabrati kategoriju!';
    }

    if (!formData.authors) {
      allErrors.authors = 'Morate izabrati autora!';
    }

    if (!formData.knjigaKolicina) {
      allErrors.knjigaKolicina = 'Morate unijeti količinu!';
    } else if (isNaN(formData.knjigaKolicina) || parseInt(formData.knjigaKolicina) <= 0) {
      allErrors.knjigaKolicina = 'Količina mora biti pozitivan broj!';
    }

    if (formData.godinaIzdavanja && (isNaN(formData.godinaIzdavanja) || formData.godinaIzdavanja.toString().length !== 4)) {
      allErrors.godinaIzdavanja = 'Godina mora biti četvorocifreni broj!';
    }

    if (formData.brStrana && (isNaN(formData.brStrana) || parseInt(formData.brStrana) <= 0)) {
      allErrors.brStrana = 'Broj strana mora biti pozitivan broj!';
    }

    if (formData.isbn && formData.isbn.toString().length < 10) {
      allErrors.isbn = 'ISBN mora imati najmanje 10 cifara!';
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Molimo ispravite greške u formi');
      if (allErrors.nazivKnjiga || allErrors.categories || allErrors.authors || allErrors.knjigaKolicina || allErrors.godinaIzdavanja) {
        setActiveTab('osnovni');
      } else if (allErrors.brStrana || allErrors.isbn) {
        setActiveTab('specifikacija');
      }
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const requestBody = {
        nazivKnjiga: formData.nazivKnjiga,
        brStrana: formData.brStrana ? parseInt(formData.brStrana) : null,
        pismo: formData.pismo || null,
        jezik: formData.jezik || null,
        povez: formData.povez || null,
        format: formData.format || null,
        izdavac: formData.izdavac || null,
        godinaIzdavanja: formData.godinaIzdavanja ? parseInt(formData.godinaIzdavanja) : null,
        isbn: formData.isbn ? parseInt(formData.isbn) : null,
        knjigaKolicina: parseInt(formData.knjigaKolicina),
        kratki_sadrzaj: formData.kratki_sadrzaj || '',
        deletePdfs: 0,
        categories: formData.categories ? [formData.categories] : [],
        genres: formData.genres ? [formData.genres] : [],
        authors: formData.authors ? [formData.authors] : [],
        pictures: pictures
      };

      const response = await fetch('https://biblioteka.simonovicp.com/api/books/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        toast.success('Knjiga uspješno dodana!');
        setTimeout(() => {
          navigate('/dashboard/knjige');
        }, 1500);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          Object.values(errorData.errors).forEach(errorArray => {
            errorArray.forEach(error => toast.error(error));
          });
        } else {
          toast.error('Greška pri dodavanju knjige.');
        }
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dodaj-bibliotekara-container">
      <ToastContainer position='top-center' />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="form-header">
        <h2>Nova Knjiga</h2>
        <p className="breadcrumbs">Evidencija knjiga / Nova knjiga</p>
      </div>

      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'tab-active' : 'tab-button'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form className="bibliotekar-form" onSubmit={handleSubmit}>
        {activeTab === 'osnovni' && (
          <div className="tab-content">
            <div className="floating-label-group">
              <input
                type="text"
                name="nazivKnjiga"
                id="nazivKnjiga"
                placeholder=" "
                value={formData.nazivKnjiga}
                onChange={handleChange}
              />
              <label htmlFor="nazivKnjiga">Naziv knjige</label>
              {errors.nazivKnjiga && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.nazivKnjiga}</div>}
            </div>

            <div className="floating-label-group">
              <textarea
                name="kratki_sadrzaj"
                id="kratki_sadrzaj"
                placeholder=" "
                value={formData.kratki_sadrzaj}
                onChange={handleChange}
                rows={4}
              />
              <label htmlFor="kratki_sadrzaj">Kratak sadržaj knjige</label>
              {errors.kratki_sadrzaj && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.kratki_sadrzaj}</div>}
            </div>

            <div className="floating-label-group">
              <select name="categories" id="categories" value={formData.categories} onChange={handleChange}>
                <option value="">Izaberite kategoriju</option>
                <option value="1">Roman</option>
                <option value="2">Udžbenici</option>
                <option value="3">Drama</option>
                <option value="4">Komedija</option>
                <option value="5">Triler</option>
                <option value="6">Poezija</option>
              </select>
              <label htmlFor="categories">Kategorija</label>
              {errors.categories && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.categories}</div>}
            </div>

            <div className="floating-label-group">
              <select name="genres" id="genres" value={formData.genres} onChange={handleChange}>
                <option value="">Izaberite žanr</option>
                <option value="1">Drama</option>
                <option value="2">Komedija</option>
                <option value="3">Akcija</option>
                <option value="4">Romantika</option>
                <option value="5">Horor</option>
                <option value="6">Fantastika</option>
              </select>
              <label htmlFor="genres">Žanr</label>
              {errors.genres && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.genres}</div>}
            </div>

            <div className="floating-label-group">
              <select name="authors" id="authors" value={formData.authors} onChange={handleChange}>
                <option value="">Izaberite autora</option>
                <option value="53">Ivo Andrić</option>
                <option value="54">Mark Twain</option>
                <option value="55">Paulo Coelho</option>
                <option value="56">Agatha Christie</option>
                <option value="57">Stephen King</option>
              </select>
              <label htmlFor="authors">Autor</label>
              {errors.authors && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.authors}</div>}
            </div>

            <div className="floating-label-group">
              <select name="izdavac" id="izdavac" value={formData.izdavac} onChange={handleChange}>
                <option value="">Izaberite izdavača</option>
                <option value="1">Laguna</option>
                <option value="2">Vulkan</option>
                <option value="3">Dereta</option>
                <option value="4">Booka</option>
              </select>
              <label htmlFor="izdavac">Izdavač</label>
              {errors.izdavac && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.izdavac}</div>}
            </div>

            <div className="floating-label-group">
              <input
                type="text"
                name="godinaIzdavanja"
                id="godinaIzdavanja"
                placeholder=" "
                value={formData.godinaIzdavanja}
                onChange={handleChange}
              />
              <label htmlFor="godinaIzdavanja">Godina izdavanja</label>
              {errors.godinaIzdavanja && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.godinaIzdavanja}</div>}
            </div>

            <div className="floating-label-group">
              <input
                type="number"
                name="knjigaKolicina"
                id="knjigaKolicina"
                placeholder=" "
                value={formData.knjigaKolicina}
                onChange={handleChange}
                min="1"
              />
              <label htmlFor="knjigaKolicina">Količina</label>
              {errors.knjigaKolicina && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.knjigaKolicina}</div>}
            </div>
          </div>
        )}

        {activeTab === 'specifikacija' && (
          <div className="tab-content">
            <div className="floating-label-group">
              <input
                type="number"
                name="brStrana"
                id="brStrana"
                placeholder=" "
                value={formData.brStrana}
                onChange={handleChange}
                min="1"
              />
              <label htmlFor="brStrana">Broj strana</label>
              {errors.brStrana && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.brStrana}</div>}
            </div>

            <div className="floating-label-group">
              <select name="pismo" id="pismo" value={formData.pismo} onChange={handleChange}>
                <option value="">Izaberite vrstu pisma</option>
                <option value="1">Ćirilica</option>
                <option value="2">Latinica</option>
              </select>
              <label htmlFor="pismo">Vrsta pisma</label>
              {errors.pismo && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.pismo}</div>}
            </div>

            <div className="floating-label-group">
              <select name="jezik" id="jezik" value={formData.jezik} onChange={handleChange}>
                <option value="">Izaberite jezik</option>
                <option value="1">Srpski</option>
                <option value="2">Engleski</option>
                <option value="3">Njemački</option>
                <option value="4">Francuski</option>
              </select>
              <label htmlFor="jezik">Jezik</label>
              {errors.jezik && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.jezik}</div>}
            </div>

            <div className="floating-label-group">
              <select name="povez" id="povez" value={formData.povez} onChange={handleChange}>
                <option value="">Izaberite vrstu poveza</option>
                <option value="1">Tvrdi</option>
                <option value="2">Meki</option>
              </select>
              <label htmlFor="povez">Vrsta poveza</label>
              {errors.povez && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.povez}</div>}
            </div>

            <div className="floating-label-group">
              <select name="format" id="format" value={formData.format} onChange={handleChange}>
                <option value="">Izaberite vrstu formata</option>
                <option value="1">A4</option>
                <option value="2">B5</option>
                <option value="3">A5</option>
                <option value="4">Pocket</option>
              </select>
              <label htmlFor="format">Vrsta formata</label>
              {errors.format && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.format}</div>}
            </div>

            <div className="floating-label-group">
              <input
                type="text"
                name="isbn"
                id="isbn"
                placeholder=" "
                value={formData.isbn}
                onChange={handleChange}
              />
              <label htmlFor="isbn">ISBN</label>
              <small style={{ color: '#888', fontSize: '0.8em' }}>Morate unijeti ISBN (International Standard Book Number)</small>
              {errors.isbn && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.isbn}</div>}
            </div>
          </div>
        )}

        {activeTab === 'multimedia' && (
          <div className="tab-content">
            <div className="multimedia-upload-area" onClick={handleMultimediaClick}>
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm1-2h12l-3.75-5l-3 4L9 13zm-1 2V5z"></path>
                </svg>
              </div>
              <div className="upload-text">
                <span>Drag your files here or click in this area.</span>
              </div>
              <input
                type="file"
                id="multimedia"
                name="multimedia"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

            {multimedia.length > 0 && (
              <div className="multimedia-preview">
                <h4>Odabrani fajlovi:</h4>
                {multimedia.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <span>{file.name}</span>
                    <span style={{ color: '#888', fontSize: '0.8em' }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newFiles = multimedia.filter((_, index) => index !== idx);
                        setMultimedia(newFiles);
                        toast.info('Fajl uklonjen');
                      }}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#dc3545', 
                        cursor: 'pointer',
                        marginLeft: '10px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {slika && (
              <div className="photo-preview-section">
                <h4>Naslovna fotografija:</h4>
                <div className="selected-photo">
                  <img
                    src={slika}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setSlika(null);
                      setPictures([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      toast.info('Naslovna fotografija uklonjena');
                    }}
                    style={{ 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="izmjena-admin-btn izmjena-admin-btn-primary">✓ SAČUVAJ</button>
          <button
            type="button"
            className="izmjena-admin-btn izmjena-admin-btn-secondary"
            onClick={() => navigate('/dashboard/knjige')}
          >
            ✗ PONIŠTI
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaKnjiga;