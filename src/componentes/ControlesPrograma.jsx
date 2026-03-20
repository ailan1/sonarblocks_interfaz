import React from "react";

const ControlesPrograma = ({ 
  bloques, 
  onEjecutar, 
  onEliminarUltimo, 
  onLeerPrograma,
  ejecutando 
}) => {
  return (
    <div className="controles-programa">
      <button 
        className="btn-control btn-ejecutar" 
        onClick={onEjecutar} 
        disabled={ejecutando }
      >
        {ejecutando ? '⏸️ Ejecutando...' : '▶ Ejecutar'}
      </button>
      <button 
        className="btn-control btn-eliminar" 
        onClick={onEliminarUltimo} 
        disabled={ejecutando }
      >
        ⬅ Borrar último
      </button>
      <button 
        className="btn-control btn-hablar" 
        onClick={onLeerPrograma}
        disabled={ejecutando }
      >
        📢 Leer programa
      </button>
    </div>
  );
};

export default ControlesPrograma;