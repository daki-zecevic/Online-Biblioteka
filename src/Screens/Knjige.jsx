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
  const [menuOpenId, setMenuOpenId] = useState(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && !event.target.closest('.actions-cell')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpenId]);

  const handleMenuClick = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleView = (id) => {
    setMenuOpenId(null);
    navigate(`/dashboard/knjige/prikaz/${id}`);
  };

  const handleEdit = (id) => {
    setMenuOpenId(null);
    navigate(`/dashboard/knjige/${id}/edit`);
  };

  const handleDeleteClick = (book) => {
    setMenuOpenId(null);
    setDeleteId(book.id);
    setShowDeleteModal(true);
  };

  const handleWriteOff = async (id) => {
    setMenuOpenId(null);
    const borrowIds = prompt('Unesite ID-jeve izdavanja za otpis (odvojene zarezom):');
    if (!borrowIds) return;
    
    const toWriteoff = borrowIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    if (toWriteoff.length === 0) {
      toast.error('Molimo unesite validne ID-jeve.');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const response = await fetch('https://biblioteka.simonovicp.com/api/books/otpisi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ toWriteoff })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Knjige su uspešno otpisane.');
      } else {
        toast.error('Greška pri otpisu knjiga.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    setMenuOpenId(null);
    const borrowIds = prompt('Unesite ID-jeve izdavanja za vraćanje (odvojene zarezom):');
    if (!borrowIds) return;
    
    const toReturn = borrowIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    if (toReturn.length === 0) {
      toast.error('Molimo unesite validne ID-jeve.');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const response = await fetch('https://biblioteka.simonovicp.com/api/books/vrati', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ toReturn })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Knjige su uspešno vraćene.');
      } else {
        toast.error('Greška pri vraćanju knjiga.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (id) => {
    setMenuOpenId(null);
    const studentId = prompt('Unesite ID učenika:');
    if (!studentId) return;
    
    const datumRezervisanja = prompt('Unesite datum rezervisanja (MM/DD/YYYY):');
    if (!datumRezervisanja) return;

    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const response = await fetch(`https://biblioteka.simonovicp.com/api/books/${id}/reserve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          datumRezervisanja
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Knjiga je uspešno rezervisana.');
      } else {
        toast.error('Greška pri rezervisanju knjige.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (id) => {
    setMenuOpenId(null);
    const studentId = prompt('Unesite ID učenika:');
    if (!studentId) return;
    
    const datumIzdavanja = prompt('Unesite datum izdavanja (MM/DD/YYYY):');
    if (!datumIzdavanja) return;
    
    const datumVracanja = prompt('Unesite datum vraćanja (MM/DD/YYYY):');
    if (!datumVracanja) return;

    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const response = await fetch(`https://biblioteka.simonovicp.com/api/books/${id}/izdaj`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          datumIzdavanja,
          datumVracanja
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Knjiga je uspešno izdata.');
      } else {
        toast.error('Greška pri izdavanju knjige.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
                  <span
                    className="admin-list-menu-dots"
                    onClick={() => handleMenuClick(book.id)}
                  >⋮</span>
                  {menuOpenId === book.id && (
                    <div className="admin-list-dropdown-menu">
                      <button className="admin-list-dropdown-btn" onClick={() => handleView(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h8a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm13.586 4L14 4.414V8zM12 4H6v16h12V10h-5a1 1 0 0 1-1-1zm-4 9a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"></path>
                        </svg>
                        Pogledaj Detalje
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleEdit(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                        </svg>
                        Izmijeni Knjigu
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleIssueBook(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                        </svg>
                        Izdaj Knjigu
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleWriteOff(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 2048 2048" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" d="m1664 1532l128-128v644H128V0h1115l499 499q-35 11-60 23t-48 28t-42 36t-44 44l-10 10h-386V128H256v1792h1408zM1280 512h293l-293-293zm568 128q42 0 78 15t64 42t42 63t16 78q0 39-15 76t-43 65l-717 719q-7 2-37 9t-71 18t-89 22t-86 22t-66 16t-28 7H384v-128h544l62-249l717-718q28-28 65-42t76-15m51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 694l-34 135l135-34z"></path>
                        </svg>
                        Otpiši Knjigu
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleReturn(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m4 12h-4v3l-4.65-4.65c-.2-.2-.2-.51 0-.71L12 8v3h4z"></path>
                        </svg>
                        Vrati Knjigu
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleReserve(book.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" d="M8 1v3h8V1h2v3h4v18H2V4h4V1zM4 6v3h16V6zm16 5H4v9h16z"></path>
                          <path fill="currentColor" d="m16.914 13.25l-5.657 5.657l-3.535-3.536l1.414-1.414l2.121 2.121l4.243-4.242z"></path>
                        </svg>
                        Rezervisi Knjigu
                      </button>
                      <button className="admin-list-dropdown-btn" onClick={() => handleDeleteClick(book)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                          <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"></path>
                        </svg>
                        Izbrisi Knjigu
                      </button>
                    </div>
                  )}
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