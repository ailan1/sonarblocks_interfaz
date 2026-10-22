import { useCallback } from 'react';

export const NARRATIVA = {
  BIENVENIDA:               '¡Hola! ¡Bienvenido a SonarBlocks! Usá Tab para elegir con qué modo querés jugar hoy, y Enter para empezar. ¡Va a ser muy divertido!',
  INTROROBOBIT:             '¡Genial! ¡Ya estamos listos para programar con Robo:bit! No te olvides de conectar el robot antes de ejecutar. ¡Vamos a darle vida!',
  MODOROBOBIT:              '¡Muy bien! Elegiste Robo:bit. Con este modo vas a mover tu robot usando bloques de movimiento. ¡Vos sos el programador!',
  MODOUBIT:                 '¡Buena elección! Elegiste uBit. Con este modo podés programar la plaquita usando sensores y eventos. ¡Qué emocionante!',
  PROGRAMEMOSROBOBIT:       '¡Perfecto! Vamos a armar juntos el programa para Robo:bit. ¡Vos podés!',
  INTRUCCIONESCONECTAR:     'Conectando el robot. Asegurate de que el Robo:bit esté encendido y cerquita. ¡Ya casi!',
  ROBOBITCONECTADO:         '¡Genial! El Robo:bit está conectado y listo para recibir tus órdenes.',
  DESCONECTADO:             '¡Uy! Parece que el robot no está conectado todavía. Presioná la C para conectarlo, y después lo intentamos de nuevo.',
  SINROBOT:                 'El robot no está conectado, así que se realizará en el simulador. Si querés usar el robot, presioná la C para conectarlo.',
  ERRORCONEXION:            'No se pudo conectar el robot. Fijate que esté encendido y presioná la C para intentar de nuevo.',
  VENTANACONEXION:          'Se va a abrir una ventana. Usá Tab para moverte, la flecha abajo para elegir tu robot, y Enter para conectarlo.',
  YACONECTADO:              '¡El robot ya está conectado! Podés ejecutar tu programa.',
  RECORDARCONECTAR:         'Recordá que el robot no está conectado. Presioná la C para conectarlo.',
  SECCIONROBOTCONECTADO:    'Sección Robot. ¡El robot está conectado y listo!',
  SECCIONROBOTDESCONECTADO: 'Sección Robot. El robot no está conectado. Presioná la C para conectarlo. Se va a abrir una ventana: usá Tab para moverte, la flecha abajo para elegir tu robot, y Enter para conectarlo.',
  SINBLUETOOTH:             'Este navegador no puede conectarse al robot. Probá abrir SonarBlocks en Google Chrome.',
  CATEGORIAS:               'Usá Tab para moverte entre las secciones. Cuando estés en Categorías, las flechitas cambian la categoría. ¡Y el número de cada bloque lo agrega a tu programa! Con la C conectás el robot. Con la V cambiás la velocidad de la voz, y con la T los colores de la pantalla.',
  INICIO:                   'Categoría Inicio. Presioná el 1 para poner el bloque Al empezar. ¡Acá comienza tu programa!',
  MOVIMIENTO:               'Categoría Movimiento. Presioná 1 para Avanzar, 2 para girar a la Izquierda, 3 para girar a la Derecha.',
  ACCIONES:                 'Categoría Acciones. Presioná el 1 para que el robot Espere un momento, y el 2 para que haga Bip.',
  REPETIR:                  'Categoría Repetir. Presioná el 1 para Repetir, y el 2 para Fin de repetir. Los bloques que pongas entre los dos se repiten.',
  LUCES:                    'Categoría Luces. Presioná 1 para mostrar un Corazón, 2 para una Cruz, y 3 para Apagar las luces.',
  CUANTASVECES:             '¿Cuántas veces querés repetir? Apretá un número del 2 al 9.',
  SOLONUMEROS:              'Apretá un número del 2 al 9 para elegir cuántas veces repetir, o Retroceso para cancelar.',
  REPETIRCANCELADO:         'Listo, no agregué la repetición.',
  REPETIRAGREGADO:          (veces) => `Repetir ${veces} veces. Los bloques que agregues ahora se van a repetir. Cuando termines, agregá Fin de repetir.`,
  REPETIRYAABIERTO:         'Primero terminá la repetición que empezaste con Fin de repetir.',
  FINREPETIR:               'Fin de repetir. Los bloques que agregues ahora ya no se repiten.',
  SINREPETIRABIERTO:        'No hay ninguna repetición para terminar. Primero agregá un bloque Repetir.',
  FALTAFINREPETIR:          'Ojo: falta el bloque Fin de repetir, así que se repite hasta el final del programa.',
  VUELTA:                   (vuelta, veces) => `Vuelta ${vuelta} de ${veces}.`,
  NOHAYBLOQUE:              (numero) => `En esta categoría no hay bloque ${numero}.`,
  BIP:                      '¡Bip!',
  CORAZON:                  '¡Corazón!',
  CRUZ:                     '¡Cruz!',
  APAGARLUCES:              '¡Apagar luces!',
  HACEBIP:                  '¡El robot hace bip!',
  MUESTRACORAZON:           'El robot muestra un corazón.',
  MUESTRACRUZ:              'El robot muestra una cruz.',
  APAGALUCES:               'El robot apaga las luces.',
  LEERREPETIR:              (veces) => `Repetir ${veces} veces:`,
  LEERFINREPETIR:           'Fin de repetir.',
  PROGRAMADETENIDO:         'Programa detenido.',
  LECTURADETENIDA:          'Dejé de leer el programa.',
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

// ── Estado de voz compartido por toda la app ─────────────────────────────────
// Vive a nivel de módulo (no dentro del hook) para que la velocidad elegida,
// la voz y el último mensaje sean los mismos en todos los componentes que
// usan useAudio(). Si estuvieran en un useRef, cada componente tendría su copia.
export const VELOCIDAD_INICIAL = 0.78;

const estadoVoz = {
  velocidad:     VELOCIDAD_INICIAL,
  voz:           null,
  ultimoMensaje: '',
  generacion:    0, // aumenta en cada mensaje nuevo; corta las frases pendientes del anterior
};

const hayVoz = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

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

  estadoVoz.voz =
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

if (hayVoz()) {
  elegirVoz();
  window.speechSynthesis.addEventListener('voiceschanged', elegirVoz);
}

const _speak = (texto, onEnd) => {
  if (!texto || !hayVoz()) { onEnd?.(); return; }

  const textoLimpio = texto
    .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu, '')
    .replace(/¡/g, '')
    .replace(/!/g, '.')
    .replace(/¿/g, '')
    .trim();

  const partes = textoLimpio.split(/(?<=[.?])\s+/).filter(Boolean);

  const generacion = ++estadoVoz.generacion;
  window.speechSynthesis.cancel();
  estadoVoz.ultimoMensaje = textoLimpio;

  let terminado = false;
  const terminar = () => {
    if (terminado) return;
    terminado = true;
    onEnd?.();
  };

  let i = 0;
  const siguiente = () => {
    // Si empezó otro mensaje, no seguir con las frases de este
    if (generacion !== estadoVoz.generacion || i >= partes.length) { terminar(); return; }
    const u = new SpeechSynthesisUtterance(partes[i++]);
    u.lang  = 'es-AR';
    u.rate  = estadoVoz.velocidad;
    u.pitch = 1.1;
    if (estadoVoz.voz) u.voice = estadoVoz.voz;
    u.onend   = siguiente;
    u.onerror = siguiente;
    window.speechSynthesis.speak(u);
  };
  siguiente();
};

export function useAudio() {
  const hablar          = useCallback((texto) => { _speak(texto, null); }, []);
  const hablarYEsperar  = useCallback((texto) => new Promise(r => _speak(texto, r)), []);
  const pararAudio      = useCallback(() => {
    if (!hayVoz()) return;
    estadoVoz.generacion++;
    window.speechSynthesis.cancel();
  }, []);
  const repetirUltimo   = useCallback(() => { if (estadoVoz.ultimoMensaje) _speak(estadoVoz.ultimoMensaje, null); }, []);
  const setVelocidad    = useCallback((rate) => { estadoVoz.velocidad = Math.max(0.5, Math.min(1.5, rate)); }, []);
  const desbloquearAudio = useCallback(() => {
    if (!hayVoz()) return;
    const s = new SpeechSynthesisUtterance(' ');
    s.volume = 0;
    window.speechSynthesis.speak(s);
  }, []);

  return { hablar, hablarYEsperar, pararAudio, repetirUltimo, setVelocidad, desbloquearAudio, narrativa: NARRATIVA };
}