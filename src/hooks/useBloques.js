import { useState, useCallback } from 'react';
import { obtenerBloque, obtenerBloquesPorModo } from '../datos/bloquesData';
import { useAudio } from './useAudio';
import { useMicrobit } from './useMicrobit';

/**
 * useBloques
 * Centraliza toda la lógica de estado y ejecución de bloques.
 * App.js solo llama este hook y pasa los resultados a los componentes.
 */
export function useBloques(tipoProgramacion) {
  const [bloques, setBloques] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);

  const { hablar, hablarYEsperar, narrativa } = useAudio();
  const { enviarComando, estaConectado } = useMicrobit();

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- Mapa de narrativa por nombre de bloque ---
  // Al agregar un bloque nuevo en bloquesData, solo editás este mapa.
  const NARRATIVA_AGREGAR = {
    'Al empezar': narrativa.BLOQUEINICIO,
    'Avanzar':    narrativa.AVANZAR,
    'Izquierda':  narrativa.IZQUIERDA,
    'Derecha':    narrativa.DERECHA,
    'Esperar':    narrativa.ESPERAR,
  };

  const NARRATIVA_EJECUTAR = {
    'Avanzar':   narrativa.AVANZANDO,
    'Izquierda': narrativa.GIRARIZQUIERDA,
    'Derecha':   narrativa.GIRARDERECHA,
    'Esperar':   narrativa.ESPERAR,
  };

  const NARRATIVA_LEER = {
    'Avanzar':   narrativa.LEERAVANZAR,
    'Izquierda': narrativa.LEERIZQUIERDA,
    'Derecha':   narrativa.LEERDERECHA,
    'Esperar':   narrativa.LEERESPERAR,
  };

  // --- Acciones ---

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
    await esperar(2000);
  }, [bloques, hablar, narrativa]);

  const limpiarBloques = useCallback(() => {
    setBloques([]);
  }, []);

  // --- Loop genérico para iterar bloques con narrativa ---
  const _iterarBloques = async (mapaAudio) => {
    for (let i = 1; i < bloques.length; i++) {
      const bloque = bloques[i];
      if (bloque.startsWith('Decir:')) continue; // manejado externamente si se necesita
      const bloqueData = obtenerBloque(tipoProgramacion, bloque);
      if (!bloqueData) continue;
      const mensajeAudio = mapaAudio[bloqueData.nombre];
      if (mensajeAudio) hablarYEsperar(mensajeAudio);
      await esperar(2000);
    }
  };

  const ejecutarPrograma = useCallback(async () => {
    if (ejecutando) {
      hablar('El programa ya se está ejecutando');
      return;
    }
    if (bloques[0] !== 'Al empezar') {
      hablar(narrativa.BLOQUEINICIOPARACOMENZAR);
      return;
    }
    if (bloques.length === 1) {
      hablar('Tu programa está vacío. Agrega más bloques');
      return;
    }

    setEjecutando(true);
    try {
      if (!estaConectado) {
        hablar(narrativa.DESCONECTADO);
        return;
      }

      for (let i = 1; i < bloques.length; i++) {
        const bloque = bloques[i];
        if (bloque.startsWith('Decir:')) continue;
        const bloqueData = obtenerBloque(tipoProgramacion, bloque);
        if (!bloqueData) continue;

        const mensajeAudio = NARRATIVA_EJECUTAR[bloqueData.nombre];
        if (mensajeAudio) hablarYEsperar(mensajeAudio);
        if (enviarComando) enviarComando(bloqueData.codigo);
        await esperar(2000);
      }
      hablar(narrativa.FINPROGRAMACION);
    } catch (err) {
      console.error('Error ejecutando programa:', err);
      hablar('Ha ocurrido un error');
    } finally {
      setEjecutando(false);
    }
  }, [ejecutando, bloques, tipoProgramacion, estaConectado, enviarComando, hablar, hablarYEsperar, narrativa]);

  const leerPrograma = useCallback(async () => {
    if (bloques.length === 0) {
      hablar('El programa está vacío');
      return;
    }
    hablarYEsperar(narrativa.REVISARCODIGO);
    await esperar(2000);
    await _iterarBloques(NARRATIVA_LEER);
  }, [bloques, tipoProgramacion, hablar, hablarYEsperar, narrativa]);

  return {
    bloques,
    ejecutando,
    agregarBloque,
    eliminarUltimoBloque,
    limpiarBloques,
    ejecutarPrograma,
    leerPrograma,
  };
}
