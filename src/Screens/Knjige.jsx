import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Knjige.css';

const Knjige = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('https://biblioteka.simonovicp.com/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBooks(data.data || data);
        } else {
          toast.error('Greška pri učitavanju knjiga.');
        }
      } catch (error) {
        toast.error('Greška pri povezivanju sa serverom.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu knjigu?')) return;
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
        setBooks(prev => prev.filter(book => book.id !== id));
      } else {
        toast.error('Greška pri brisanju knjige.');
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    await handleDelete(deleteId);
  };

  return (
    <div className="knjige-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="knjige-header">
        <button className="add-btn" onClick={() => navigate('/dashboard/knjige/n')}>+ NOVA KNJIGA</button>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <table className="knjige-table">
        <thead>
          <tr>
            <th>Naslovna</th>
            <th>Naziv knjige</th>
            <th>Autor</th>
            <th>Kategorija</th>
            <th>Na raspolaganju</th>
            <th>Rezervisano</th>
            <th>Izdato</th>
            <th>U prekoračenju</th>
            <th>Ukupna količina</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <img
                  src={book.photo || (book.pictures && book.pictures.length > 0 ? book.pictures[0][0] : '/Resources/default.jpg')}
                  alt="Naslovna"
                  style={{ width: 40, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                />
              </td>
              <td>{book.title || book.nazivKnjiga || '-'}</td>
              <td>
                {book.authors && Array.isArray(book.authors)
                  ? book.authors.map(a => a.name || a).join(', ')
                  : (book.author || '-')}
              </td>
              <td>
                {book.categories && Array.isArray(book.categories)
                  ? book.categories.map(c => c.name || c).join(', ')
                  : (book.category || '-')}
              </td>
              <td>{book.samples ?? book.knjigaKolicina ?? '-'}</td>
              <td>{book.reserved ?? '-'}</td>
              <td>{book.issued ?? '-'}</td>
              <td>{book.overdue ?? '-'}</td>
              <td>{book.total ?? book.knjigaKolicina ?? book.samples ?? '-'}</td>
              <td>
                <button onClick={() => navigate(`/dashboard/knjige/prikaz/${book.id}`)}>👁️</button>
                <button
                  style={{ marginLeft: 8, color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => openDeleteModal(book.id)}
                  title="Obriši knjigu"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <span>Rows per page: 20</span>
        <span>1 of 1</span>
        <span>{`< >`}</span>
      </div>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Potvrda brisanja</h3>
            <p>Da li ste sigurni da želite da obrišete ovu knjigu?</p>
            <div className="modal-actions">
              <button className="sacuvaj-btn" onClick={confirmDelete}>Obriši</button>
              <button className="ponisti-btn" onClick={closeDeleteModal}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knjige;