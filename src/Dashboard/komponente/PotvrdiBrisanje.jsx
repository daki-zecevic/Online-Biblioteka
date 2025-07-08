import React from 'react';
import './PotvrdiBrisanje.css';

const PotvrdiBrisanje = ({ onConfirm, onCancel, korisnik }) => {
  return (
    <div className="brisanje-overlay">
      <div className="brisanje-modal">
        <h3>Da li ste sigurni?</h3>
        <p>Želite obrisati bibliotekara <strong>{korisnik.name}</strong>?</p>
        <div className="brisanje-buttons">
          <button className="otkazi-btn" onClick={onCancel}>Otkaži</button>
          <button className="obrisi-btn" onClick={onConfirm}>Obriši</button>
        </div>
      </div>
    </div>
  );
};

export default PotvrdiBrisanje;
