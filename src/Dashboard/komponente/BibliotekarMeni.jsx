import React, { useState } from "react";
import './BibliotekarMeni.css';
import PotvrdiBrisanje from "./PotvrdiBrisanje";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BibliotekarMeni = ({ onClose, onBrisi, id }) => {
  const [prikaziPotvrdu, setPrikaziPotvrdu] = useState(false);
  const navigate = useNavigate();

  if (!id) {
    return null; 
  }

  const handleDetalji = () => {
    onClose();
    navigate(`/dashboard/bibliotekari/${id}`);
  };

  const handleIzmjena = () => {
    onClose();
    navigate(`/dashboard/bibliotekari/izmijeni/${id}`);
  };

  const handlePotvrdi = () => {
    setPrikaziPotvrdu(false);
    onBrisi();
    onClose();
  };

  return (
    <div className="bibliotekar-meni">
      <button onClick={handleDetalji} aria-label="Pogledaj detalje">
        <FaEye /> Pogledaj Detalje
      </button>

      <button onClick={handleIzmjena} aria-label="Izmijeni bibliotekara">
        <FaEdit /> Izmijeni Bibliotekara
      </button>

      <button onClick={() => setPrikaziPotvrdu(true)} aria-label="Izbriši bibliotekara">
        <FaTrash /> Izbriši Bibliotekara
      </button>

      {prikaziPotvrdu && (
        <PotvrdiBrisanje
          poruka="Da li ste sigurni da želite da izbrišete bibliotekara?"
          onPotvrdi={handlePotvrdi}
          onOtkazi={() => setPrikaziPotvrdu(false)}
        />
      )}
    </div>
  );
};

export default BibliotekarMeni;
