import React from 'react';
import Icono from './Icono';

/**
 * ControlContraste
 *
 * Cambia entre los colores estándar y alto contraste.
 * También se puede cambiar con la tecla T (ver useTeclado).
 */
const ControlContraste = ({ etiqueta, onCambiar }) => (
  <button
    className="btn-barra"
    onClick={onCambiar}
    aria-label={`Colores: ${etiqueta}. Presioná T para cambiar.`}
    title="Cambiar el contraste de los colores"
  >
    <span className="btn-texto"><Icono nombre="contraste" /> {etiqueta}</span>
    <span className="btn-atajo">Presioná T</span>
  </button>
);

export default ControlContraste;
