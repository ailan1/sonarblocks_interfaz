import React from 'react';
import Icono from './Icono';

/**
 * ControlVelocidad
 *
 * Cambia la velocidad de la voz en 3 niveles (lenta, estándar, rápida).
 * También se puede cambiar con la tecla V (ver useTeclado).
 */
const ControlVelocidad = ({ etiqueta, onCambiar }) => (
  <button
    className="btn-barra"
    onClick={onCambiar}
    aria-label={`Velocidad de voz: ${etiqueta}. Presioná V para cambiar.`}
    title="Cambiar velocidad de la voz"
  >
    <span className="btn-texto"><Icono nombre="velocidad" /> {etiqueta}</span>
    <span className="btn-atajo">Presioná V</span>
  </button>
);

export default ControlVelocidad;
