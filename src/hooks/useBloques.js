import { useState, useCallback } from 'react';
import { obtenerBloque } from '../datos/bloquesData';
import { useAudio, NARRATIVA } from './useAudio';

// Tiempo que dura cada bloque al ejecutar (robot y simulador usan el mismo)
export const DURACION_BLOQUE = 2000;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const NARRATIVA_AGREGAR = {
  'Al empezar': NARRATIVA.BLOQUEINICIO,
  'Avanzar':    NARRATIVA.AVANZAR,
  'Izquierda':  NARRATIVA.IZQUIERDA,
  'Derecha':    NARRATIVA.DERECHA,
  'Esperar':    NARRATIVA.ESPERAR,
};

const NARRATIVA_EJECUTAR = {
  'Avanzar':   NARRATIVA.AVANZANDO,
  'Izquierda': NARRATIVA.GIRARIZQUIERDA,
  'Derecha':   NARRATIVA.GIRARDERECHA,
  'Esperar':   NARRATIVA.ESPERAR,
};

const NARRATIVA_LEER = {
  'Avanzar':   NARRATIVA.LEERAVANZAR,
  'Izquierda': NARRATIVA.LEERIZQUIERDA,
  'Derecha':   NARRATIVA.LEERDERECHA,
  'Esperar':   NARRATIVA.LEERESPERAR,
};

export function useBloques(tipoProgramacion, { enviarComando, estaConectado } = {}) {
  const [bloques, setBloques]           = useState([]);
  const [ejecutando, setEjecutando]     = useState(false);
  const [indiceActual, setIndiceActual] = useState(null); // ← posición del bloque que se está ejecutando

  const { hablar, hablarYEsperar, narrativa } = useAudio();

  const agregarBloque = useCallback((nombreBloque) => {
    if (nombreBloque === 'Al empezar' && bloques.includes('Al empezar')) {
      hablar(narrativa.YATIENESINICIO);
      return;
    }
    const bloqueData = obtenerBloque(tipoProgramacion, nombreBloque);
    let bloqueFinal = nombreBloque;
    if (bloqueData?.conInput) {
      const texto = prompt('Escribe el mensaje que quieres que el personaje diga:');
      if (!texto) return;
      bloqueFinal = `Decir: ${texto}`;
    }
    setBloques((prev) =>
      nombreBloque === 'Al empezar' ? ['Al empezar', ...prev] : [...prev, bloqueFinal]
    );
    const mensaje = NARRATIVA_AGREGAR[nombreBloque];
    if (mensaje) hablar(mensaje);
  }, [bloques, tipoProgramacion, hablar, narrativa]);

  const eliminarUltimoBloque = useCallback(async () => {
    if (bloques.length === 0) {
      hablar('No hay bloques para borrar');
      return;
    }
    setBloques((prev) => prev.slice(0, -1));
    hablar(narrativa.ELIMINARULTIMOBLOQUE);
  }, [bloques, hablar, narrativa]);

  const limpiarBloques = useCallback(() => {
    setBloques([]);
  }, []);

  const ejecutarPrograma = useCallback(async () => {
    if (ejecutando)                  { hablar('El programa ya se está ejecutando');          return; }
    if (bloques[0] !== 'Al empezar') { hablar(narrativa.BLOQUEINICIOPARACOMENZAR);          return; }
    if (bloques.length === 1)        { hablar('Tu programa está vacío. Agrega más bloques'); return; }

    setEjecutando(true);
    setIndiceActual(null);

    try {
      // Se espera a que termine el aviso; si no, el primer bloque lo cortaría
      if (!estaConectado) await hablarYEsperar(narrativa.SINROBOT);

      for (let i = 1; i < bloques.length; i++) {
        const bloque = bloques[i];
        if (bloque.startsWith('Decir:')) continue;
        const bloqueData = obtenerBloque(tipoProgramacion, bloque);
        if (!bloqueData) continue;

        // El simulador reacciona a este cambio al mismo tiempo que el robot físico
        setIndiceActual(i);

        // Hablar en paralelo — no bloquea el loop
        const mensajeAudio = NARRATIVA_EJECUTAR[bloqueData.nombre];
        if (mensajeAudio) hablar(mensajeAudio);

        // Enviar al robot físico si está conectado
        if (estaConectado && enviarComando) await enviarComando(bloqueData.codigo);

        // Esperar tiempo fijo por bloque para que el simulador y el robot tengan tiempo de actuar
        await esperar(DURACION_BLOQUE);
      }
      hablar(narrativa.FINPROGRAMACION);
    } catch (err) {
      console.error('Error ejecutando programa:', err);
      hablar('Ha ocurrido un error');
    } finally {
      setEjecutando(false);
      setIndiceActual(null);
    }
  }, [ejecutando, bloques, tipoProgramacion, estaConectado, enviarComando, hablar, hablarYEsperar, narrativa]);

  const leerPrograma = useCallback(async () => {
    if (bloques.length === 0) { hablar('El programa está vacío'); return; }
    await hablarYEsperar(narrativa.REVISARCODIGO);
    await esperar(1000);
    for (let i = 1; i < bloques.length; i++) {
      const bloque = bloques[i];
      if (bloque.startsWith('Decir:')) continue;
      const bloqueData = obtenerBloque(tipoProgramacion, bloque);
      if (!bloqueData) continue;
      const mensajeAudio = NARRATIVA_LEER[bloqueData.nombre];
      if (mensajeAudio) await hablarYEsperar(mensajeAudio);
      await esperar(2000);
    }
  }, [bloques, tipoProgramacion, hablar, hablarYEsperar, narrativa]);

  return {
    bloques,
    ejecutando,
    indiceActual,
    agregarBloque,
    eliminarUltimoBloque,
    limpiarBloques,
    ejecutarPrograma,
    leerPrograma,
  };
}