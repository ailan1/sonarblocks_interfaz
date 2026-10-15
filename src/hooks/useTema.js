import { useState, useLayoutEffect, useCallback } from 'react';
import { useAudio } from './useAudio';

const CLAVE_GUARDADO = 'sonarblocks_tema';

export const TEMAS = [
  { id: 'estandar',       etiqueta: 'Estándar' },
  { id: 'alto-contraste', etiqueta: 'Alto contraste' },
];

// Primero lo que eligió el usuario la última vez; si no hay nada,
// lo que pide el sistema operativo (configuración de alto contraste).
const temaInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADO);
    if (TEMAS.some((t) => t.id === guardado)) return guardado;
  } catch {}
  if (window.matchMedia?.('(prefers-contrast: more)').matches) return 'alto-contraste';
  return 'estandar';
};

export function useTema() {
  const [tema, setTema] = useState(temaInicial);
  const { hablar } = useAudio();

  // useLayoutEffect: aplica el tema antes de pintar, sin parpadeo
  useLayoutEffect(() => {
    document.documentElement.dataset.tema = tema;
    try { localStorage.setItem(CLAVE_GUARDADO, tema); } catch {}
  }, [tema]);

  const cambiarTema = useCallback(() => {
    const actual    = TEMAS.findIndex((t) => t.id === tema);
    const siguiente = TEMAS[(actual + 1) % TEMAS.length];
    setTema(siguiente.id);
    hablar(`Colores: ${siguiente.etiqueta}`);
  }, [tema, hablar]);

  const etiqueta = TEMAS.find((t) => t.id === tema)?.etiqueta;

  return { tema, etiqueta, cambiarTema };
}
