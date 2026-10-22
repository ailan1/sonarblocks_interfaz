import React from "react";
import Icono from "./Icono";

// Mientras se ejecuta, "Ejecutar" pasa a ser "Parar"; mientras se lee, "Leer
// programa" pasa a ser "Parar lectura". Las dos cosas también se paran con Escape.
const ControlesPrograma = ({
  onEjecutar,
  onEliminarUltimo,
  onLeerPrograma,
  onParar,
  ejecutando,
  leyendo,
  activa,
}) => {
  return (
    <div className={`controles-programa seccion ${activa ? 'seccion-activa' : ''}`}>
      {ejecutando ? (
        <button className="btn-control btn-parar" onClick={onParar}>
          <Icono nombre="parar" fill="currentColor" /> Parar <span className="btn-tecla">Esc</span>
        </button>
      ) : (
        <button className="btn-control btn-ejecutar" onClick={onEjecutar}>
          <Icono nombre="ejecutar" /> Ejecutar
        </button>
      )}
      <button
        className="btn-control btn-eliminar"
        onClick={onEliminarUltimo}
        disabled={ejecutando}
      >
        <Icono nombre="borrar" /> Borrar último
      </button>
      {leyendo ? (
        <button className="btn-control btn-parar" onClick={onParar}>
          <Icono nombre="parar" fill="currentColor" /> Parar lectura <span className="btn-tecla">Esc</span>
        </button>
      ) : (
        <button
          className="btn-control btn-hablar"
          onClick={onLeerPrograma}
          disabled={ejecutando}
        >
          <Icono nombre="leer" /> Leer programa
        </button>
      )}
    </div>
  );
};

export default ControlesPrograma;
