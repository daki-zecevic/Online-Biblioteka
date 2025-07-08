import React from "react";
import './BibliotekarMeni.css';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const BibliotekarMeni = ({ onClose }) => {
  return (
    <div className="bibliotekar-meni">
      <button onClick={() => {  onClose(); }}>
        <FaEye />
        Pogledaj Detalje
      </button>
      <button onClick={() => {  onClose(); }}>
        <FaEdit />
        Izmijeni Bibliotekara
      </button>
      <button onClick={() => {  onClose(); }}>
        <FaTrash />
        Izbrisi Bibliotekara
      </button>
    </div>
  );
};

export default BibliotekarMeni;
