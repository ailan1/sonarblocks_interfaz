import React from "react";
import Icono from "./Icono";

const ControlesPrograma = ({
  bloques,
  onEjecutar,
  onEliminarUltimo,
  onLeerPrograma,
  ejecutando,
  activa,
}) => {
  return (
    <div className={`controles-programa seccion ${activa ? 'seccion-activa' : ''}`}>
      <button
        className="btn-control btn-ejecutar"
        onClick={onEjecutar}
        disabled={ejecutando}
      >
        {ejecutando
          ? <><Icono nombre="ejecutando" className="icono-girando" /> Ejecutando...</>
          : <><Icono nombre="ejecutar" /> Ejecutar</>}
      </button>
      <button
        className="btn-control btn-eliminar"
        onClick={onEliminarUltimo}
        disabled={ejecutando}
      >
        <Icono nombre="borrar" /> Borrar último
      </button>
      <button
        className="btn-control btn-hablar"
        onClick={onLeerPrograma}
        disabled={ejecutando}
      >
        <Icono nombre="leer" /> Leer programa
      </button>
    </div>
  );
};

export default ControlesPrograma;
