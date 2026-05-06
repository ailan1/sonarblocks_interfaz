import { useRef, useCallback, useEffect } from 'react';

export const NARRATIVA = {
  // Bienvenida y modos
  BIENVENIDA:               '¡Hola! Bienvenido a SonarBlocks. Usá Tab para elegir con qué modo querés trabajar hoy, y Enter para empezar.',
  INTROROBOBIT:             '¡Genial! Ya estamos listos para programar con Robo:bit. Acordate de conectar el robot antes de ejecutar.',
  MODOROBOBIT:              'Muy bien, elegiste Robo:bit. Con este modo vas a mover tu robot con bloques de movimiento. ¡Vamos!',
  MODOUBIT:                 'Buena elección, elegiste uBit. Con este modo podés programar la plaquita usando sensores y eventos.',
  PROGRAMEMOSROBOBIT:       '¡Perfecto! Empecemos a armar el programa para Robo:bit.',

  // Conexión
  INTRUCCIONESCONECTAR:     'Conectando el robot... Asegurate de que el Robo:bit esté encendido y cerca.',
  ROBOBITCONECTADO:         '¡Listo! El Robo:bit está conectado y listo para recibir órdenes.',
  DESCONECTADO:             'Ups, parece que el robot no está conectado todavía. Presioná C para conectarlo y después intentamos de nuevo.',

  // Categorías
  CATEGORIAS:               'Usá Tab para moverte entre secciones. Cuando estés en Categorías, las flechas cambian la categoría, y la letra que aparece en cada bloque lo agrega a tu programa.',
  INICIO:    'Categoría Inicio. Presioná 1 para poner el bloque Al empezar.',
MOVIMIENTO:'Categoría Movimiento. 1 para Avanzar, 2 para Izquierda, 3 para Derecha.',
ACCIONES:  'Categoría Acciones. 1 para que el robot Espere.',
  // Bloques al agregar
  BLOQUEINICIO:             '¡Bien! Pusiste el bloque "Al empezar". Este es el punto de inicio de tu programa.',
  AVANZAR:                  'Avanzar, listo.',
  IZQUIERDA:                'Izquierda, listo.',
  DERECHA:                  'Derecha, listo.',
  ESPERAR:                  'Esperar, listo.',
  YATIENESINICIO:           'Ya tenés el bloque "Al empezar". Solo puede haber uno en el programa.',

  // Eliminar
  ELIMINARULTIMOBLOQUE:     'Borré el último bloque.',

  // Ejecución
  BLOQUEINICIOPARACOMENZAR: 'Para ejecutar el programa necesitás poner el bloque "Al empezar" al principio. ¡Ya casi!',
  AVANZANDO:                'Avanzando.',
  GIRARIZQUIERDA:           'Girando a la izquierda.',
  GIRARDERECHA:             'Girando a la derecha.',
  FINPROGRAMACION:          '¡Programa terminado! ¿Cómo le fue al robot?',

  // Lectura del programa
  REVISARCODIGO:            'Te leo el programa que armaste.',
  LEERAVANZAR:              'Avanzar.',
  LEERIZQUIERDA:            'Izquierda.',
  LEERDERECHA:              'Derecha.',
  LEERESPERAR:              'Esperar.',
};
// ─────────────────────────────────────────────────────────────────────────────

export function useAudio() {
  const ultimoMensajeRef = useRef('');
  const velocidadRef     = useRef(0.88);
  const vozRef           = useRef(null);

  // Elegir la primera voz en español disponible
  useEffect(() => {
    const elegirVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      vozRef.current =
        voces.find((v) => v.lang.startsWith('es') && v.localService) ||
        voces.find((v) => v.lang.startsWith('es')) ||
        voces[0] ||
        null;
    };
    elegirVoz();
    window.speechSynthesis.addEventListener('voiceschanged', elegirVoz);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', elegirVoz);
  }, []);

  // Función interna base: cancela lo anterior y habla
  const _speak = useCallback((texto, onEnd) => {
    if (!texto) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    ultimoMensajeRef.current = texto;

    const u = new SpeechSynthesisUtterance(texto);
    u.lang  = 'es-ES';
    u.rate  = velocidadRef.current;
    if (vozRef.current) u.voice = vozRef.current;
    u.onend   = () => onEnd?.();
    u.onerror = () => onEnd?.();
    window.speechSynthesis.speak(u);
  }, []);

  
  const hablar = useCallback((texto) => {
    _speak(texto, null);
  }, [_speak]);

  
  const hablarYEsperar = useCallback((texto) => {
    return new Promise((resolve) => _speak(texto, resolve));
  }, [_speak]);

  
  const pararAudio = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const repetirUltimo = useCallback(() => {
    if (ultimoMensajeRef.current) _speak(ultimoMensajeRef.current, null);
  }, [_speak]);

  
  const setVelocidad = useCallback((rate) => {
    velocidadRef.current = Math.max(0.5, Math.min(1.5, rate));
  }, []);

  
  const desbloquearAudio = useCallback(() => {
    const s = new SpeechSynthesisUtterance(' ');
    s.volume = 0;
    window.speechSynthesis.speak(s);
  }, []);

  return {
    hablar,
    hablarYEsperar,
    pararAudio,
    repetirUltimo,
    setVelocidad,
    desbloquearAudio,
    narrativa: NARRATIVA,
  };
}