import React, { useState } from "react";
import './BibliotekarMeni.css';
import PotvrdiBrisanje from "./PotvrdiBrisanje";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const BibliotekarMeni = ({ onClose, onBrisi }) => {
  const [prikaziPotvrdu, setPrikaziPotvrdu] = useState(false);

  const handlePotvrdi = () => {
    setPrikaziPotvrdu(false);
    onBrisi(); 
    onClose(); 
  };

  return (
    <div className="bibliotekar-meni">
      <button onClick={() => { onClose(); }}>
        <FaEye /> Pogledaj Detalje
      </button>
      <button onClick={() => { onClose(); }}>
        <FaEdit /> Izmijeni Bibliotekara
      </button>
      <button onClick={() => { setPrikaziPotvrdu(true); }}>
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
