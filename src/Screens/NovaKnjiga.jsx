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
    photoPath: ''
  });

  const [activeTab, setActiveTab] = useState('osnovni');
  const [errors, setErrors] = useState({});
  const [slika, setSlika] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
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
      setFormData((prev) => ({
        ...prev,
        photoPath: imageUrl,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
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
    
    // Validate all required fields before submission
    const allErrors = {};
    
    if (!formData.naziv.trim()) {
      allErrors.naziv = 'Morate unijeti naziv knjige!';
    }

    if (!formData.kategorija) {
      allErrors.kategorija = 'Morate izabrati kategoriju!';
    }

    if (!formData.autor) {
      allErrors.autor = 'Morate izabrati autora!';
    }

    if (!formData.kolicina.trim()) {
      allErrors.kolicina = 'Morate unijeti količinu!';
    } else if (isNaN(formData.kolicina) || parseInt(formData.kolicina) <= 0) {
      allErrors.kolicina = 'Količina mora biti pozitivan broj!';
    }

    if (formData.godina && (isNaN(formData.godina) || formData.godina.length !== 4)) {
      allErrors.godina = 'Godina mora biti četvorocifreni broj!';
    }

    if (formData.brojStrana && (isNaN(formData.brojStrana) || parseInt(formData.brojStrana) <= 0)) {
      allErrors.brojStrana = 'Broj strana mora biti pozitivan broj!';
    }

    if (formData.isbn && formData.isbn.length < 10) {
      allErrors.isbn = 'ISBN mora imati najmanje 10 cifara!';
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Molimo ispravite greške u formi');
      // Switch to the tab with errors
      if (allErrors.naziv || allErrors.kategorija || allErrors.autor || allErrors.kolicina || allErrors.godina) {
        setActiveTab('osnovni');
      } else if (allErrors.brojStrana || allErrors.isbn) {
        setActiveTab('specifikacija');
      }
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'photoPath' && value) {
          data.append(key, value);
        }
      });

      // Add photo
      if (fileInputRef.current?.files[0]) {
        data.append('photo', fileInputRef.current.files[0]);
      }

      // Add multimedia files
      multimedia.forEach((file, idx) => {
        data.append(`multimedia[${idx}]`, file);
      });

      const response = await fetch('https://biblioteka.simonovicp.com/api/books/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
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
                name="naziv"
                id="naziv"
                placeholder=" "
                value={formData.naziv}
                onChange={handleChange}
              />
              <label htmlFor="naziv">Naziv knjige</label>
              {errors.naziv && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.naziv}</div>}
            </div>

            <div className="floating-label-group">
              <textarea
                name="opis"
                id="opis"
                placeholder=" "
                value={formData.opis}
                onChange={handleChange}
                rows={4}
              />
              <label htmlFor="opis">Kratak sadržaj knjige</label>
              {errors.opis && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.opis}</div>}
            </div>

            <div className="floating-label-group">
              <select name="kategorija" id="kategorija" value={formData.kategorija} onChange={handleChange}>
                <option value="">Izaberite kategoriju</option>
                <option value="Roman">Roman</option>
                <option value="Udžbenici">Udžbenici</option>
                <option value="Drama">Drama</option>
                <option value="Komedija">Komedija</option>
                <option value="Triler">Triler</option>
                <option value="Poezija">Poezija</option>
              </select>
              <label htmlFor="kategorija">Kategorija</label>
              {errors.kategorija && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.kategorija}</div>}
            </div>

            <div className="floating-label-group">
              <select name="zanr" id="zanr" value={formData.zanr} onChange={handleChange}>
                <option value="">Izaberite žanr</option>
                <option value="Drama">Drama</option>
                <option value="Komedija">Komedija</option>
                <option value="Akcija">Akcija</option>
                <option value="Romantika">Romantika</option>
                <option value="Horor">Horor</option>
                <option value="Fantastika">Fantastika</option>
              </select>
              <label htmlFor="zanr">Žanr</label>
              {errors.zanr && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.zanr}</div>}
            </div>

            <div className="floating-label-group">
              <select name="autor" id="autor" value={formData.autor} onChange={handleChange}>
                <option value="">Izaberite autora</option>
                <option value="Ivo Andrić">Ivo Andrić</option>
                <option value="Mark Twain">Mark Twain</option>
                <option value="Paulo Coelho">Paulo Coelho</option>
                <option value="Agatha Christie">Agatha Christie</option>
                <option value="Stephen King">Stephen King</option>
              </select>
              <label htmlFor="autor">Autor</label>
              {errors.autor && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.autor}</div>}
            </div>

            <div className="floating-label-group">
              <select name="izdavac" id="izdavac" value={formData.izdavac} onChange={handleChange}>
                <option value="">Izaberite izdavača</option>
                <option value="Laguna">Laguna</option>
                <option value="Vulkan">Vulkan</option>
                <option value="Dereta">Dereta</option>
                <option value="Booka">Booka</option>
              </select>
              <label htmlFor="izdavac">Izdavač</label>
              {errors.izdavac && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.izdavac}</div>}
            </div>

            <div className="floating-label-group">
              <input
                type="text"
                name="godina"
                id="godina"
                placeholder=" "
                value={formData.godina}
                onChange={handleChange}
              />
              <label htmlFor="godina">Godina izdavanja</label>
              {errors.godina && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.godina}</div>}
            </div>

            <div className="floating-label-group">
              <input
                type="number"
                name="kolicina"
                id="kolicina"
                placeholder=" "
                value={formData.kolicina}
                onChange={handleChange}
                min="1"
              />
              <label htmlFor="kolicina">Količina</label>
              {errors.kolicina && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.kolicina}</div>}
            </div>
          </div>
        )}

        {activeTab === 'specifikacija' && (
          <div className="tab-content">
            <div className="floating-label-group">
              <input
                type="number"
                name="brojStrana"
                id="brojStrana"
                placeholder=" "
                value={formData.brojStrana}
                onChange={handleChange}
                min="1"
              />
              <label htmlFor="brojStrana">Broj strana</label>
              {errors.brojStrana && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.brojStrana}</div>}
            </div>

            <div className="floating-label-group">
              <select name="vrstaPisma" id="vrstaPisma" value={formData.vrstaPisma} onChange={handleChange}>
                <option value="">Izaberite vrstu pisma</option>
                <option value="Ćirilica">Ćirilica</option>
                <option value="Latinica">Latinica</option>
              </select>
              <label htmlFor="vrstaPisma">Vrsta pisma</label>
              {errors.vrstaPisma && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.vrstaPisma}</div>}
            </div>

            <div className="floating-label-group">
              <select name="vrstaPoveza" id="vrstaPoveza" value={formData.vrstaPoveza} onChange={handleChange}>
                <option value="">Izaberite vrstu poveza</option>
                <option value="Tvrdi">Tvrdi</option>
                <option value="Meki">Meki</option>
              </select>
              <label htmlFor="vrstaPoveza">Vrsta poveza</label>
              {errors.vrstaPoveza && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.vrstaPoveza}</div>}
            </div>

            <div className="floating-label-group">
              <select name="vrstaFormata" id="vrstaFormata" value={formData.vrstaFormata} onChange={handleChange}>
                <option value="">Izaberite vrstu formata</option>
                <option value="A4">A4</option>
                <option value="B5">B5</option>
                <option value="A5">A5</option>
                <option value="Pocket">Pocket</option>
              </select>
              <label htmlFor="vrstaFormata">Vrsta formata</label>
              {errors.vrstaFormata && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.vrstaFormata}</div>}
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
                      setFormData(prev => ({ ...prev, photoPath: '' }));
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