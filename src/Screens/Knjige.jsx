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
        <div className="header-left">
          <h1>Knjige</h1>
          <button className="nova-knjiga-btn" onClick={() => navigate('/dashboard/knjige/n')}>
            + NOVA KNJIGA
          </button>
        </div>
        <div className="header-right">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input" 
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="knjige-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="select-all-checkbox" />
              </th>
              <th>
                Naziv Knjige 
                <span className="sort-arrow">↕</span>
              </th>
              <th>
                Autor 
                <span className="sort-arrow">↕</span>
              </th>
              <th>
                Kategorija 
                <span className="sort-arrow">↕</span>
              </th>
              <th>Na raspolaganju</th>
              <th>Rezervisano</th>
              <th>Izdato</th>
              <th>U prekoračenju</th>
              <th>Ukupna količina</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <input type="checkbox" className="row-checkbox" />
                </td>
                <td className="book-info">
                  <div className="book-details">
                    <img
                      src={book.photo || (book.pictures && book.pictures.length > 0 ? book.pictures[0][0] : '/Resources/default.jpg')}
                      alt="Naslovna"
                      className="book-cover"
                    />
                    <span className="book-title">{book.title || book.nazivKnjiga || '-'}</span>
                  </div>
                </td>
                <td className="author-cell">
                  {book.authors && Array.isArray(book.authors)
                    ? book.authors.map(a => a.name || a).join(', ')
                    : (book.author || '-')}
                </td>
                <td className="category-cell">
                  {book.categories && Array.isArray(book.categories)
                    ? book.categories.map(c => c.name || c).join(', ')
                    : (book.category || '-')}
                </td>
                <td className="number-cell">{book.samples ?? book.knjigaKolicina ?? '-'}</td>
                <td className="number-cell">{book.reserved ?? '-'}</td>
                <td className="number-cell">{book.issued ?? '-'}</td>
                <td className="number-cell">{book.overdue ?? '-'}</td>
                <td className="number-cell">{book.total ?? book.knjigaKolicina ?? book.samples ?? '-'}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => navigate(`/dashboard/knjige/prikaz/${book.id}`)}
                      title="Pogledaj detalje"
                    >
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="pagination-info">
          <span>Rows per page: </span>
          <select className="rows-per-page">
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="pagination-controls">
          <span>1 of 1</span>
          <button className="pagination-btn">‹</button>
          <button className="pagination-btn">›</button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Potvrda brisanja</h3>
            <p>Da li ste sigurni da želite da obrišete ovu knjigu?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDelete}>Obriši</button>
              <button className="cancel-btn" onClick={closeDeleteModal}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knjige;