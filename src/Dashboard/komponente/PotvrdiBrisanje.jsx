import React from "react";
import './PotvrdiBrisanje.css';

const PotvrdiBrisanje = ({ poruka, onPotvrdi, onOtkazi }) => {
  return (
    <div className="potvrdi-brisanje-overlay">
      <div className="potvrdi-brisanje-modal">
        <p>{poruka}</p>
        <div className="dugmad">
          <button onClick={onPotvrdi} className="potvrdi">Da</button>
          <button onClick={onOtkazi} className="otkazi">Ne</button>
        </div>
      </div>
    </div>
  );
};

export default PotvrdiBrisanje;
