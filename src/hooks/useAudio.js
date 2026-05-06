import { useRef, useCallback, useEffect } from 'react';

export const NARRATIVA = {
  BIENVENIDA:               '¡Hola! ¡Bienvenido a SonarBlocks! Usá Tab para elegir con qué modo querés jugar hoy, y Enter para empezar. ¡Va a ser muy divertido!',
  INTROROBOBIT:             '¡Genial! ¡Ya estamos listos para programar con Robo:bit! No te olvides de conectar el robot antes de ejecutar. ¡Vamos a darle vida!',
  MODOROBOBIT:              '¡Muy bien! Elegiste Robo:bit. Con este modo vas a mover tu robot usando bloques de movimiento. ¡Vos sos el programador!',
  MODOUBIT:                 '¡Buena elección! Elegiste uBit. Con este modo podés programar la plaquita usando sensores y eventos. ¡Qué emocionante!',
  PROGRAMEMOSROBOBIT:       '¡Perfecto! Vamos a armar juntos el programa para Robo:bit. ¡Vos podés!',
  INTRUCCIONESCONECTAR:     'Conectando el robot. Asegurate de que el Robo:bit esté encendido y cerquita. ¡Ya casi!',
  ROBOBITCONECTADO:         '¡Genial! El Robo:bit está conectado y listo para recibir tus órdenes.',
  DESCONECTADO:             '¡Uy! Parece que el robot no está conectado todavía. Presioná la C para conectarlo, y después lo intentamos de nuevo.',
  CATEGORIAS:               'Usá Tab para moverte entre las secciones. Cuando estés en Categorías, las flechitas cambian la categoría. ¡Y la letra de cada bloque lo agrega a tu programa!',
  INICIO:                   'Categoría Inicio. Presioná el 1 para poner el bloque Al empezar. ¡Acá comienza tu programa!',
  MOVIMIENTO:               'Categoría Movimiento. Presioná 1 para Avanzar, 2 para girar a la Izquierda, 3 para girar a la Derecha.',
  ACCIONES:                 'Categoría Acciones. Presioná el 1 para que el robot Espere un momento.',
  BLOQUEINICIO:             '¡Muy bien! Pusiste el bloque Al empezar. ¡Este es el comienzo de tu programa!',
  AVANZAR:                  '¡Avanzar!',
  IZQUIERDA:                '¡A la izquierda!',
  DERECHA:                  '¡A la derecha! ',
  ESPERAR:                  '¡Esperar!',
  YATIENESINICIO:           '¡Ya tenés el bloque Al empezar! Solo puede haber uno en el programa. ¡Seguí agregando más bloques!',
  ELIMINARULTIMOBLOQUE:     'Borré el último bloque.',
  BLOQUEINICIOPARACOMENZAR: 'Para ejecutar el programa, primero poné el bloque Al empezar al principio. ',
  AVANZANDO:                '¡El robot está avanzando! ',
  GIRARIZQUIERDA:           '¡Girando a la izquierda!',
  GIRARDERECHA:             '¡Girando a la derecha!',
  FINPROGRAMACION:          '¡Programa terminado! ¡Lo lograste! ¿Cómo le fue al robot?',
  REVISARCODIGO:            'Ahora te leo el programa que armaste. ¡Escuchá con atención!',
  LEERAVANZAR:              'Avanzar.',
  LEERIZQUIERDA:            'Izquierda.',
  LEERDERECHA:              'Derecha.',
  LEERESPERAR:              'Esperar.',
};

export function useAudio() {
  const ultimoMensajeRef = useRef('');
  const velocidadRef     = useRef(0.78);
  const vozRef           = useRef(null);

  useEffect(() => {
    const elegirVoz = () => {
      const voces = window.speechSynthesis.getVoices();

      const preferidas = [
        'Paulina',
        'Monica',
        'Google español',
        'Google español de Estados Unidos',
        'Microsoft Sabina',
        'Microsoft Helena',
        'Microsoft Laura',
        'Mónica',
        'Jorge',
      ];

      vozRef.current =
        preferidas.reduce((encontrada, nombre) =>
          encontrada || voces.find(v => v.name.includes(nombre)) || null
        , null) ||
        voces.find(v => v.lang === 'es-AR') ||
        voces.find(v => v.lang === 'es-MX') ||
        voces.find(v => v.lang === 'es-ES') ||
        voces.find(v => v.lang.startsWith('es')) ||
        voces[0] ||
        null;
    };

    elegirVoz();
    window.speechSynthesis.addEventListener('voiceschanged', elegirVoz);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', elegirVoz);
  }, []);

  const _speak = useCallback((texto, onEnd) => {
    if (!texto) { onEnd?.(); return; }

    const textoLimpio = texto
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu, '')
      .replace(/¡/g, '')
      .replace(/!/g, '.')
      .replace(/¿/g, '')
      .trim();

    const partes = textoLimpio.split(/(?<=[.?])\s+/).filter(Boolean);

    window.speechSynthesis.cancel();
    ultimoMensajeRef.current = textoLimpio;

    let i = 0;
    const siguiente = () => {
      if (i >= partes.length) { onEnd?.(); return; }
      const u = new SpeechSynthesisUtterance(partes[i++]);
      u.lang  = 'es-AR';
      u.rate  = velocidadRef.current;
      u.pitch = 1.1;
      if (vozRef.current) u.voice = vozRef.current;
      u.onend   = siguiente;
      u.onerror = siguiente;
      window.speechSynthesis.speak(u);
    };
    siguiente();
  }, []);

  const hablar          = useCallback((texto) => { _speak(texto, null); }, [_speak]);
  const hablarYEsperar  = useCallback((texto) => new Promise(r => _speak(texto, r)), [_speak]);
  const pararAudio      = useCallback(() => { window.speechSynthesis.cancel(); }, []);
  const repetirUltimo   = useCallback(() => { if (ultimoMensajeRef.current) _speak(ultimoMensajeRef.current, null); }, [_speak]);
  const setVelocidad    = useCallback((rate) => { velocidadRef.current = Math.max(0.5, Math.min(1.5, rate)); }, []);
  const desbloquearAudio = useCallback(() => {
    const s = new SpeechSynthesisUtterance(' ');
    s.volume = 0;
    window.speechSynthesis.speak(s);
  }, []);

  return { hablar, hablarYEsperar, pararAudio, repetirUltimo, setVelocidad, desbloquearAudio, narrativa: NARRATIVA };
}