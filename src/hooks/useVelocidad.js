import { useState, useEffect, useCallback } from 'react';
import { useAudio, VELOCIDAD_INICIAL } from './useAudio';

const CLAVE_GUARDADO = 'sonarblocks_velocidad';

export const NIVELES_VELOCIDAD = [
  { valor: 0.6,               etiqueta: 'Lenta' },
  { valor: VELOCIDAD_INICIAL, etiqueta: 'Estándar' },
  { valor: 1.15,              etiqueta: 'Rápida' },
];

const NIVEL_ESTANDAR = 1;

// Recuerda la velocidad que eligió el usuario la última vez
const nivelInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADO);
    const nivel = guardado === null ? NaN : Number(guardado);
    if (NIVELES_VELOCIDAD[nivel]) return nivel;
  } catch {}
  return NIVEL_ESTANDAR;
};

export function useVelocidad() {
  const [nivel, setNivel] = useState(nivelInicial);
  const { setVelocidad, hablar } = useAudio();

  useEffect(() => {
    setVelocidad(NIVELES_VELOCIDAD[nivel].valor);
    try { localStorage.setItem(CLAVE_GUARDADO, String(nivel)); } catch {}
  }, [nivel, setVelocidad]);

  const cambiarVelocidad = useCallback(() => {
    const siguiente = (nivel + 1) % NIVELES_VELOCIDAD.length;
    // Se aplica ya, así el aviso se escucha con la velocidad nueva
    setVelocidad(NIVELES_VELOCIDAD[siguiente].valor);
    setNivel(siguiente);
    hablar(`Velocidad de voz: ${NIVELES_VELOCIDAD[siguiente].etiqueta}`);
  }, [nivel, setVelocidad, hablar]);

  return { etiqueta: NIVELES_VELOCIDAD[nivel].etiqueta, cambiarVelocidad };
}
