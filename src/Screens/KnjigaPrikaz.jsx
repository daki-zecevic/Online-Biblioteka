import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/KnjigaPrikaz.css';

const TABS = [
  { key: 'osnovni', label: 'Osnovni Detalji' },
  { key: 'specifikacija', label: 'Specifikacija' },
  { key: 'evidencija', label: 'Evidencija iznajmljivanja' },
  { key: 'multimedia', label: 'Multimedia' },
];

const KnjigaPrikaz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('osnovni');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`https://biblioteka.simonovicp.com/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setBook(data.data || data);
      } catch (error) {
        toast.error('Greška pri dohvatanju knjige.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleWriteOff = () => {
    toast.info('Opcija "Otpiši knjigu" će biti implementirana uskoro.');
  };

  const handleEdit = () => {
    navigate(`/dashboard/knjige/${id}/edit`);
  };

  const handleReturn = () => {
    toast.info('Opcija "Vrati knjigu" će biti implementirana uskoro.');
  };

  const handleReserve = () => {
    toast.info('Opcija "Rezerviši knjigu" će biti implementirana uskoro.');
  };

  const handleDelete = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu knjigu?')) {
      toast.info('Opcija "Obriši knjigu" će biti implementirana uskoro.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!book) return (
    <div>
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      {!loading && <div>Učitavanje...</div>}
    </div>
  );

  return (
    <div className="knjiga-prikaz-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      
      <div className="knjiga-prikaz-content">
        <div className="knjiga-main-content">
          <div className="knjiga-header">
            <div className="header-left">
              <h1>{book.title || book.nazivKnjiga || book.naziv}</h1>
              <p className="breadcrumbs">Evidencija knjiga / KNJIGA-{book.id}</p>
            </div>
            <div className="knjiga-actions">
              <button className="action-btn" onClick={handleWriteOff}>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 2048 2048">
                  <path fill="currentColor" d="m1664 1532l128-128v644H128V0h1115l499 499q-35 11-60 23t-48 28t-42 36t-44 44l-10 10h-386V128H256v1792h1408zM1280 512h293l-293-293zm568 128q42 0 78 15t64 42t42 63t16 78q0 39-15 76t-43 65l-717 719q-7 2-37 9t-71 18t-89 22t-86 22t-66 16t-28 7H384v-128h544l62-249l717-718q28-28 65-42t76-15m51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 694l-34 135l135-34z"></path>
                </svg>
                Otpiši knjigu
              </button>
              <button className="action-btn" onClick={handleEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12">
                  <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                </svg>
                Izdaj knjigu
              </button>
              <button className="action-btn" onClick={handleReturn}>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m4 12h-4v3l-4.65-4.65c-.2-.2-.2-.51 0-.71L12 8v3h4z"></path>
                </svg>
                Vrati knjigu
              </button>
              <button className="action-btn" onClick={handleReserve}>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 1v3h8V1h2v3h4v18H2V4h4V1zM4 6v3h16V6zm16 5H4v9h16z"></path>
                  <path fill="currentColor" d="m16.914 13.25l-5.657 5.657l-3.535-3.536l1.414-1.414l2.121 2.121l4.243-4.242z"></path>
                </svg>
                Rezerviši knjigu
              </button>
              <div className="dropdown-container">
                <button className="three-dots-btn" onClick={toggleDropdown}>
                  ⋮
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleEdit}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12">
                        <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                      </svg>
                      Izmijeni Knjigu
                    </button>
                    <button className="dropdown-item" onClick={handleDelete}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"></path>
                      </svg>
                      Obriši Knjigu
                    </button>
                  </div>
                )}
              </div>
            </div>
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

          <div className="knjiga-content">
            {activeTab === 'osnovni' && (
              <div className="osnovni-detalji">
                <div className="book-info-section">
                  <div className="book-image-container">
                    <img 
                      src={book.photo || (book.pictures && book.pictures.length > 0 ? book.pictures[0][0] : '/Resources/default.jpg')} 
                      alt={book.title || book.nazivKnjiga} 
                      className="knjiga-cover"
                    />
                  </div>
                  <div className="book-details-table">
                    <table className="details-table">
                      <tbody>
                        <tr>
                          <td className="label-cell">Naziv Knjige:</td>
                          <td className="value-cell">{book.title || book.nazivKnjiga || book.naziv}</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Autor:</td>
                          <td className="value-cell">
                            {book.authors && Array.isArray(book.authors) 
                              ? book.authors.map(a => a.name || a).join(', ') 
                              : (book.author || book.autor || 'Mark Twain')}
                          </td>
                        </tr>
                        <tr>
                          <td className="label-cell">Kategorija:</td>
                          <td className="value-cell">
                            {book.categories && Array.isArray(book.categories) 
                              ? book.categories.map(c => c.name || c).join(', ') 
                              : (book.category || book.kategorija || 'Romani')}
                          </td>
                        </tr>
                        <tr>
                          <td className="label-cell">Izdavač:</td>
                          <td className="value-cell">{book.izdavac || 'Delfi Knjizara'}</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Žanr:</td>
                          <td className="value-cell">
                            {book.genres && Array.isArray(book.genres) 
                              ? book.genres.map(g => g.name || g).join(', ') 
                              : (book.genre || 'Za djecu')}
                          </td>
                        </tr>
                        <tr>
                          <td className="label-cell">Godina izdavanja:</td>
                          <td className="value-cell">{book.godinaIzdavanja || '30.03.2011'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="storyline-section">
                  <div className="storyline-header">Storyline (Kratak Sadržaj)</div>
                  <div className="storyline-content">
                    {book.kratki_sadrzaj || book.storyline || 'Tom Sojer je roman koji počinje smatramo i autobiografijom jer je utemeljen na doživljavima samog Marka Tvena. Autor ga je pisao u nekoliko navrata, prvi dio napisao je u zimu 1872. godine, drugi dio u godine 1874. godine. Napisan je jednostavnim stilom i uz mnogo pripovedanja i humora pa je jednako interesantan i deci i odraslima. Tven je ovim romanom hteo da otkrije čitaoce podkosti na decistvo. Tvenjeje u romanu Tom Sojer od'}...
                  </div>
                  <button className="show-more-btn">Prikaži više</button>
                </div>
              </div>
            )}

            {activeTab === 'specifikacija' && (
              <div className="specifikacija-tab">
                <div className="detail-row">
                  <span className="detail-label">Broj strana:</span>
                  <span className="detail-value">{book.brStrana || book.brojStrana || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Pismo:</span>
                  <span className="detail-value">
                    {book.pismo
                      ? (typeof book.pismo === 'object' ? book.pismo.name : book.pismo)
                      : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Jezik:</span>
                  <span className="detail-value">
                    {book.jezik
                      ? (typeof book.jezik === 'object' ? book.jezik.name : book.jezik)
                      : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Povez:</span>
                  <span className="detail-value">
                    {book.povez
                      ? (typeof book.povez === 'object' ? book.povez.name : book.povez)
                      : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Format:</span>
                  <span className="detail-value">
                    {book.format
                      ? (typeof book.format === 'object' ? book.format.name : book.format)
                      : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">International Standard Book Number (ISBN):</span>
                  <span className="detail-value">{book.isbn || '-'}</span>
                </div>
              </div>
            )}

            {activeTab === 'evidencija' && (
              <div className="evidencija-tab">
                <p>Evidencija iznajmljivanja će biti implementirana uskoro.</p>
              </div>
            )}

            {activeTab === 'multimedia' && (
              <div className="multimedia-tab">
                <div className="multimedia-preview">
                  {book.pictures && book.pictures.length > 0 ? (
                    book.pictures.map((pic, idx) => (
                      <div key={idx} className="multimedia-item">
                        <img src={pic[0]} alt={`Slika ${idx + 1}`} className="multimedia-image" />
                      </div>
                    ))
                  ) : (
                    <span>Nema slike.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="knjiga-sidebar">
          <div className="sidebar-section">
            <div className="status-item available">
              <span className="status-label">Na raspolaganju:</span>
              <span className="status-value">{book.samples ?? '5 primjeraka'}</span>
            </div>
            <div className="status-item reserved">
              <span className="status-label">Rezervisano:</span>
              <span className="status-value">{book.reserved ?? '2 primjerka'}</span>
            </div>
            <div className="status-item issued">
              <span className="status-label">Izdato:</span>
              <span className="status-value">{book.issued ?? '105 primjeraka'}</span>
            </div>
            <div className="status-item overdue">
              <span className="status-label">U prekoračenju:</span>
              <span className="status-value">{book.overdue ?? '2 primjerka'}</span>
            </div>
            <div className="status-item total">
              <span className="status-label">Ukupna količina:</span>
              <span className="status-value">{book.total ?? book.knjigaKolicina ?? '15 primjeraka'}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Izdavanje knjige</h3>
            <div className="recent-activity">
              <div className="activity-item">
                <span className="activity-date">4 days ago</span>
                <div className="activity-description">
                  <span className="activity-action">je izdala knjigu</span>
                  <span className="activity-user">Pero Perovski</span>
                  <span className="activity-time">dana 21.02.20 21</span>
                </div>
                <button className="activity-details">pogledaj detalja &gt;&gt;</button>
              </div>
              <div className="activity-item">
                <span className="activity-date">4 days ago</span>
                <div className="activity-description">
                  <span className="activity-action">je izdala knjigu</span>
                  <span className="activity-user">Pero Perovski</span>
                  <span className="activity-time">dana 21.02.20 21</span>
                </div>
                <button className="activity-details">pogledaj detalja &gt;&gt;</button>
              </div>
              <div className="activity-item">
                <span className="activity-date">4 days ago</span>
                <div className="activity-description">
                  <span className="activity-action">je izdala knjigu</span>
                  <span className="activity-user">Pero Perovski</span>
                  <span className="activity-time">dana 21.02.20 21</span>
                </div>
                <button className="activity-details">pogledaj detalja &gt;&gt;</button>
              </div>
              <button className="show-more-activity">Prikaži više</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnjigaPrikaz;