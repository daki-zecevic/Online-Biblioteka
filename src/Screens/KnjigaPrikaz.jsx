import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/KnjigaPrikaz.css';

const TABS = [
  { key: 'osnovni', label: 'Osnovni Detalji' },
  { key: 'specifikacija', label: 'Specifikacija' },
  { key: 'evidencija', label: 'Evidencija iznajmljivanja' },
  { key: 'multimedia', label: 'Multimedija' },
];

const KnjigaPrikaz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('osnovni');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`https://biblioteka.simonovicp.com/api/books/${id}/destroy`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success('Knjiga je obrisana.');
        setTimeout(() => navigate('/dashboard/knjige'), 1200);
      } else {
        toast.error('Greška pri brisanju knjige.');
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
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
    <div className="knjiga-detalji-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="gornji-bar">
        <h2>{book.title || book.nazivKnjiga || book.naziv}</h2>
        <p className="breadcrumbs">Evidencija knjiga / KNJIGA-{book.id}</p>
        <div className="akcije">
          <button onClick={() => navigate(`/dashboard/knjige/edit/${book.id}`)}>✎ Izmijeni podatke</button>
          <button onClick={() => setShowDeleteModal(true)} style={{ color: '#e74c3c', marginLeft: 8 }}>🗑️ Obriši knjigu</button>
          <button onClick={() => navigate('/dashboard/knjige')} style={{ marginLeft: 8 }}>⟵ Nazad</button>
        </div>
      </div>
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
      {activeTab === 'osnovni' && (
        <div className="knjiga-info-kartica">
          <div className="knjiga-slika">
            <img src={book.photo || (book.pictures && book.pictures.length > 0 ? book.pictures[0][0] : '/Resources/default.jpg')} alt="Knjiga" />
          </div>
          <div className="knjiga-podaci">
            <p><strong>Naziv Knjige:</strong> {book.title || book.nazivKnjiga || book.naziv}</p>
            <p><strong>Autor:</strong> {book.authors && Array.isArray(book.authors) ? book.authors.map(a => a.name || a).join(', ') : (book.author || book.autor || '-')}</p>
            <p><strong>Kategorija:</strong> {book.categories && Array.isArray(book.categories) ? book.categories.map(c => c.name || c).join(', ') : (book.category || book.kategorija || '-')}</p>
            <p><strong>Izdavač:</strong> {book.izdavac || '-'}</p>
            <p><strong>Žanr:</strong> {book.genres && Array.isArray(book.genres) ? book.genres.map(g => g.name || g).join(', ') : (book.genre || '-')}</p>
            <p><strong>Godina izdavanja:</strong> {book.godinaIzdavanja || '-'}</p>
            <p><strong>Storyline (Kratak Sadržaj):</strong></p>
            <div style={{ marginLeft: 12 }}>{book.kratki_sadrzaj || book.storyline || '-'}</div>
          </div>
          <div className="knjiga-status">
            <p><strong>Na raspolaganju:</strong> <span className="status-green">{book.samples ?? '-'}</span></p>
            <p><strong>Rezervisano:</strong> <span className="status-orange">{book.reserved ?? '-'}</span></p>
            <p><strong>Izdato:</strong> <span className="status-blue">{book.issued ?? '-'}</span></p>
            <p><strong>U prekoračenju:</strong> <span className="status-red">{book.overdue ?? '-'}</span></p>
            <p><strong>Ukupna količina:</strong> <span className="status-gray">{book.total ?? book.knjigaKolicina ?? '-'}</span></p>
          </div>
        </div>
      )}
      {activeTab === 'specifikacija' && (
        <div className="knjiga-specifikacija">
          <p><strong>Broj strana:</strong> {book.brStrana || book.brojStrana || '-'}</p>
          <p><strong>Pismo:</strong> {
            book.pismo
              ? (typeof book.pismo === 'object' ? book.pismo.name : book.pismo)
              : '-'
          }</p>
          <p><strong>Jezik:</strong> {
            book.jezik
              ? (typeof book.jezik === 'object' ? book.jezik.name : book.jezik)
              : '-'
          }</p>
          <p><strong>Povez:</strong> {
            book.povez
              ? (typeof book.povez === 'object' ? book.povez.name : book.povez)
              : '-'
          }</p>
          <p><strong>Format:</strong> {
            book.format
              ? (typeof book.format === 'object' ? book.format.name : book.format)
              : '-'
          }</p>
          <p><strong>International Standard Book Number (ISBN):</strong></p>
          <p>{book.isbn || '-'}</p>
        </div>
      )}
      {activeTab === 'evidencija' && (
        <div className="knjiga-evidencija">
        </div>
      )}
      {activeTab === 'multimedia' && (
        <div className="knjiga-multimedia">
    
          <div className="multimedia-preview">
            {book.pictures && book.pictures.length > 0 ? (
              book.pictures.map((pic, idx) => (
                <div key={idx} style={{ display: 'inline-block', marginRight: 12 }}>
                  <img src={pic[0]} alt={`Slika ${idx + 1}`} style={{ width: 90, height: 120, objectFit: 'cover', borderRadius: 6 }} />
                </div>
              ))
            ) : (
              <span>Nema slike.</span>
            )}
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Potvrda brisanja</h3>
            <p>Da li ste sigurni da želite da obrišete ovu knjigu?</p>
            <div className="modal-actions">
              <button className="sacuvaj-btn" onClick={handleDelete}>Obriši</button>
              <button className="ponisti-btn" onClick={() => setShowDeleteModal(false)}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnjigaPrikaz;