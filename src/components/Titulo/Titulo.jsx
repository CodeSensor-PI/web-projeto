import React from 'react';
import './Titulo.css';

const Titulo = ({ titulo, subtitulo, className = "" }) => {
  return (
    <div className={`titulo-container ${className}`}>
      <h2 className="titulo-principal">{titulo}</h2>
      {subtitulo && <h3 className="titulo-subtitulo">{subtitulo}</h3>}
    </div>
  );
};

export default Titulo;
