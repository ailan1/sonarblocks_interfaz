import React, { useState } from 'react';
import { useAudio } from '../hooks/useAudio';

/**
 * ControlVelocidad
 *
 * Permite al usuario ajustar la velocidad de la voz en 3 niveles.
 * Accesible por teclado: Tab llega al botón, Enter o Espacio cambian el nivel.
 *
 * Colocar en BarraSuperior junto al botón de conectar.
 */

const NIVELES = [
  { valor: 0.7,  etiqueta: 'Lenta',  atajo: 'Velocidad lenta' },
  { valor: 0.9,  etiqueta: 'Normal', atajo: 'Velocidad normal' },
  { valor: 1.15, etiqueta: 'Rápida', atajo: 'Velocidad rápida' },
];

const ControlVelocidad = () => {
  const { setVelocidad, hablar } = useAudio();
  const [nivelActual, setNivelActual] = useState(1); // Normal por defecto

  const cambiarVelocidad = () => {
    const siguiente = (nivelActual + 1) % NIVELES.length;
    setNivelActual(siguiente);
    setVelocidad(NIVELES[siguiente].valor);
    hablar(`Velocidad de voz: ${NIVELES[siguiente].etiqueta}`);
  };

  const nivel = NIVELES[nivelActual];

  return (
    <button
      className="btn-velocidad"
      onClick={cambiarVelocidad}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && cambiarVelocidad()}
      aria-label={`Velocidad de voz: ${nivel.etiqueta}. Presioná Enter para cambiar.`}
      title="Cambiar velocidad de la voz"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F0F4FF',
        color: '#0033CC',
        border: '2px solid #0033CC',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span>🔊 {nivel.etiqueta}</span>
      <span style={{ fontSize: '0.7rem', color: '#5566AA', marginTop: 2 }}>
        Velocidad voz
      </span>
    </button>
  );
};

export default ControlVelocidad;
