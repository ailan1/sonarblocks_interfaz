import { useRef, useCallback } from "react";

// 🎧 IMPORTS DE AUDIOS
import BIENVENIDA from "./BIENVENIDA.mp3"
import MODOROBOBIT from "./MODOROBOBIT.mp3"
import MODOUBIT from "./MODOUBIT.mp3"
import PROGRAMEMOSROBOBIT from "./PROGRAMEMOSROBOBIT.mp3"
import PROGRAMEMOSUBIT from "./PROGRAMEMOSUBIT.mp3"
import INTROROBOBIT from "./INTROROBOBIT.mp3"
import INTRUCCIONESCONECTAR from "./INTRUCCIONESCONECTAR.mp3"
import ROBOBITCONECTADO from "./ROBOBITCONECTADO.mp3"
import CATEGORIAS from "./CATEGORIAS.mp3"
import MOVIMIENTO from "./MOVIMIENTO.mp3"
import INICIO from "./INICIO.mp3"
import ACCIONES from "./ACCIONES.mp3"
import DERECHA from "./DERECHA.mp3"
import IZQUIERDA from "./IZQUIERDA.mp3"
import AVANZAR from "./AVANZAR.mp3"
import YATIENESINICIO from "./YATIENESINICIO.mp3"
import GIRARDERECHA from "./GIRANDODERECHA.mp3"
import GIRARIZQUIERDA from "./GIRANDOIZQUIERDA.mp3"
import AVANZANDO from "./AVANZANDO.mp3"
import FINPROGRAMACION from "./FINPROGRAMACION.mp3"
import ELIMINARULTIMOBLOQUE from "./ELIMINARBLOQUE.mp3"
import DESCONECTADO from "./DESCONECTADO.mp3"
import LEERAVANZAR from "./LEERAVANZAR.mp3"
import LEERIZQUIERDA from "./LEERIZQUIERDA.mp3"
import LEERDERECHA from './LEERDERECHA.mp3'
import LEERESPERAR from './LEERESPERAR.mp3'
import REVISARCODIGO from './REVISARCODIGO.mp3'
import ESPERAR from './ESPERAR.mp3'
import BLOQUEINICIO from './BLOQUEINICIO.mp3'
import BLOQUEINICIOPARACOMENZAR from './BLOQUEINICIOPARACOMENZAR.mp3'










export const useAudio = () => {
  const audioRef = useRef(new Audio());

  // 🎙️ NARRATIVA (MISMA IDEA, pero con audios)
  const narrativa = {
    ESPERAR,
    LEERAVANZAR,
    LEERESPERAR,
    LEERIZQUIERDA,
    LEERDERECHA,
    BIENVENIDA,
    MODOROBOBIT,
    MODOUBIT,
    CATEGORIAS,
    INTROROBOBIT,
    PROGRAMEMOSROBOBIT,
    PROGRAMEMOSUBIT,
    INTRUCCIONESCONECTAR,
    ROBOBITCONECTADO,
    MOVIMIENTO,
    ACCIONES,
    INICIO,
    DERECHA,
    IZQUIERDA,
    ACCIONES,
    AVANZAR,
    YATIENESINICIO,
    GIRARDERECHA,
    GIRARIZQUIERDA, 
    AVANZANDO,
    FINPROGRAMACION,
    ELIMINARULTIMOBLOQUE,
    DESCONECTADO,
    REVISARCODIGO,
    BLOQUEINICIO,
    BLOQUEINICIOPARACOMENZAR,
    INTRO_PROGRAMAR: null,

   
    AREA_VACIA: null,

    CONEXION: (estado) =>
      estado
        ? null // después podés poner CONEXION_OK.mp3
        : null,

    BLOQUE_ANADIDO: (nombre, total) => null,

    BORRAR_ULTIMO: (nombre, quedan) => null,

    LEER_BLOQUE: (nombre, pos, total) => null,

    INICIO_PROGRAMA: null,
    FIN_PROGRAMA: null,
  };

  // 🔊 reproducir (simple, sin cola)
  const hablar = useCallback((src) => {
    pararAudio()
    if (!src) return;

    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.src = src;

    audio.play().catch((e) => {
      console.error("❌ Error:", e);
    });
  }, []);

  // ⏳ versión await (pero simple)
  const hablarYEsperar = useCallback((src) => {
    return new Promise((resolve) => {
      if (!src) return resolve();

      const audio = audioRef.current;

      audio.pause();
      audio.currentTime = 0;
      audio.src = src;

      audio.onended = () => resolve();

      audio.play().catch(() => resolve());
    });
  }, []);

  const pararAudio = () => {
    // 1. Pausamos el sonido
    audioRef.current.pause();
    // 2. Reiniciamos el tiempo a cero para que parezca un "Stop"
    audioRef.current.currentTime = 0;
  };

  return {
    hablar,
    hablarYEsperar,
    narrativa,pararAudio
  };
};