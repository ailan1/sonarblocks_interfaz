import { useState, useCallback, useRef } from 'react';
import { obtenerBloque } from '../datos/bloquesData';
import { useAudio, NARRATIVA } from './useAudio';
import {
  REPETIR,
  FIN_REPETIR,
  MIN_VECES,
  MAX_VECES,
  crearRepetir,
  esRepetir,
  vecesRepetir,
  hayRepetirAbierto,
  expandirPrograma,
} from '../utils/programa';

// Tiempo que dura cada bloque al ejecutar (robot y simulador usan el mismo)
export const DURACION_BLOQUE = 2000;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Comando para frenar el robot al apretar Parar (microbit/programa-microbit.js)
const COMANDO_PARAR = 'stop';

// Crea el control de una ejecución o lectura que se puede detener.
// control.hasta(promesa) espera esa promesa, salvo que antes se llame a
// control.detener(): en ese caso sigue enseguida y control.detenido queda en true.
// porUsuario distingue el botón Parar de cuando otra acción la reemplaza
// (por ejemplo, ejecutar mientras se leía): solo en el primer caso se avisa por voz.
const crearControl = () => {
  let avisar;
  const parada = new Promise((r) => { avisar = r; });
  const control = {
    detenido: false,
    porUsuario: false,
    detener: (porUsuario = false) => { control.detenido = true; control.porUsuario = porUsuario; avisar(); },
    hasta: (promesa) => Promise.race([promesa, parada]),
  };
  return control;
};

const NARRATIVA_AGREGAR = {
  'Al empezar':     NARRATIVA.BLOQUEINICIO,
  'Avanzar':        NARRATIVA.AVANZAR,
  'Izquierda':      NARRATIVA.IZQUIERDA,
  'Derecha':        NARRATIVA.DERECHA,
  'Esperar':        NARRATIVA.ESPERAR,
  'Bip':            NARRATIVA.BIP,
  'Fin de repetir': NARRATIVA.FINREPETIR,
  'Corazón':        NARRATIVA.CORAZON,
  'Cruz':           NARRATIVA.CRUZ,
  'Apagar luces':   NARRATIVA.APAGARLUCES,
};

const NARRATIVA_EJECUTAR = {
  'Avanzar':      NARRATIVA.AVANZANDO,
  'Izquierda':    NARRATIVA.GIRARIZQUIERDA,
  'Derecha':      NARRATIVA.GIRARDERECHA,
  'Esperar':      NARRATIVA.ESPERAR,
  'Bip':          NARRATIVA.HACEBIP,
  'Corazón':      NARRATIVA.MUESTRACORAZON,
  'Cruz':         NARRATIVA.MUESTRACRUZ,
  'Apagar luces': NARRATIVA.APAGALUCES,
};

const NARRATIVA_LEER = {
  'Avanzar':      NARRATIVA.LEERAVANZAR,
  'Izquierda':    NARRATIVA.LEERIZQUIERDA,
  'Derecha':      NARRATIVA.LEERDERECHA,
  'Esperar':      NARRATIVA.LEERESPERAR,
  'Bip':          'Bip.',
  'Corazón':      'Corazón.',
  'Cruz':         'Cruz.',
  'Apagar luces': 'Apagar luces.',
};

export function useBloques(tipoProgramacion, { enviarComando, estaConectado } = {}) {
  const [bloques, setBloques]           = useState([]);
  const [ejecutando, setEjecutando]     = useState(false);
  const [indiceActual, setIndiceActual] = useState(null); // ← bloque del programa que se está ejecutando
  const [pasoActual, setPasoActual]     = useState(null); // ← paso del programa desplegado (con repeticiones)
  const [esperandoVeces, setEsperandoVeces] = useState(false); // ← se agregó Repetir y falta el número
  const [leyendo, setLeyendo]           = useState(false);

  // Control de la ejecución o lectura en curso (null si no hay ninguna)
  const controlRef = useRef(null);

  const { hablar, hablarYEsperar, pararAudio, narrativa } = useAudio();

  // Detiene la ejecución o la lectura en curso (botón Parar o tecla Escape)
  const parar = useCallback(() => {
    if (!controlRef.current) return;
    controlRef.current.detener(true);
    controlRef.current = null;
    pararAudio();
  }, [pararAudio]);

  const agregarBloque = useCallback((nombreBloque) => {
    // Si estaba eligiendo cuántas veces repetir y agrega otro bloque, se cancela
    setEsperandoVeces(false);

    if (nombreBloque === 'Al empezar' && bloques.includes('Al empezar')) {
      hablar(narrativa.YATIENESINICIO);
      return;
    }

    // Repetir: primero hay que elegir cuántas veces (ver elegirVeces)
    if (nombreBloque === REPETIR) {
      if (hayRepetirAbierto(bloques)) { hablar(narrativa.REPETIRYAABIERTO); return; }
      setEsperandoVeces(true);
      hablar(narrativa.CUANTASVECES);
      return;
    }

    if (nombreBloque === FIN_REPETIR && !hayRepetirAbierto(bloques)) {
      hablar(narrativa.SINREPETIRABIERTO);
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

  const elegirVeces = useCallback((veces) => {
    if (!esperandoVeces || veces < MIN_VECES || veces > MAX_VECES) return;
    setBloques((prev) => [...prev, crearRepetir(veces)]);
    setEsperandoVeces(false);
    hablar(narrativa.REPETIRAGREGADO(veces));
  }, [esperandoVeces, hablar, narrativa]);

  const cancelarRepetir = useCallback(() => {
    setEsperandoVeces(false);
    hablar(narrativa.REPETIRCANCELADO);
  }, [hablar, narrativa]);

  const eliminarUltimoBloque = useCallback(async () => {
    if (esperandoVeces) { cancelarRepetir(); return; }
    if (bloques.length === 0) {
      hablar('No hay bloques para borrar');
      return;
    }
    setBloques((prev) => prev.slice(0, -1));
    hablar(narrativa.ELIMINARULTIMOBLOQUE);
  }, [esperandoVeces, cancelarRepetir, bloques, hablar, narrativa]);

  const limpiarBloques = useCallback(() => {
    setBloques([]);
  }, []);

  const ejecutarPrograma = useCallback(async () => {
    const pasos = expandirPrograma(bloques);

    if (ejecutando)                  { hablar('El programa ya se está ejecutando');          return; }
    if (bloques[0] !== 'Al empezar') { hablar(narrativa.BLOQUEINICIOPARACOMENZAR);          return; }
    if (pasos.length === 0)          { hablar('Tu programa está vacío. Agrega más bloques'); return; }

    controlRef.current?.detener(); // si estaba leyendo el programa, deja de leer
    const control = crearControl();
    controlRef.current = control;

    setEsperandoVeces(false);
    setEjecutando(true);
    setIndiceActual(null);
    setPasoActual(null);

    try {
      // Se espera a que terminen los avisos; si no, el primer bloque los cortaría
      if (!estaConectado) await control.hasta(hablarYEsperar(narrativa.SINROBOT));
      if (hayRepetirAbierto(bloques) && !control.detenido) await control.hasta(hablarYEsperar(narrativa.FALTAFINREPETIR));

      for (let k = 0; k < pasos.length && !control.detenido; k++) {
        const paso = pasos[k];
        if (paso.bloque.startsWith('Decir:')) continue;
        const bloqueData = obtenerBloque(tipoProgramacion, paso.bloque);
        if (!bloqueData) continue;

        // El simulador reacciona a este cambio al mismo tiempo que el robot físico
        setPasoActual(k);
        setIndiceActual(paso.indice);

        // La voz arranca junto con el robot. Al empezar cada vuelta se dice cuál es.
        let mensajeAudio = NARRATIVA_EJECUTAR[bloqueData.nombre] || '';
        if (paso.inicioVuelta) mensajeAudio = `${narrativa.VUELTA(paso.vuelta, paso.veces)} ${mensajeAudio}`;
        const voz = mensajeAudio ? hablarYEsperar(mensajeAudio) : Promise.resolve();

        // Enviar al robot físico si está conectado
        if (estaConectado && enviarComando && bloqueData.codigo) await control.hasta(enviarComando(bloqueData.codigo));

        // Cada paso dura DURACION_BLOQUE o lo que tarde la voz, lo que sea más largo.
        // Así el paso siguiente nunca corta la frase a la mitad (pasaba con "Vuelta 1 de 4. ...").
        await control.hasta(Promise.all([voz, esperar(DURACION_BLOQUE)]));
      }

      if (control.detenido) {
        if (estaConectado && enviarComando) enviarComando(COMANDO_PARAR);
        hablar(narrativa.PROGRAMADETENIDO);
      } else {
        hablar(narrativa.FINPROGRAMACION);
      }
    } catch (err) {
      console.error('Error ejecutando programa:', err);
      hablar('Ha ocurrido un error');
    } finally {
      if (controlRef.current === control) controlRef.current = null;
      setEjecutando(false);
      setIndiceActual(null);
      setPasoActual(null);
    }
  }, [ejecutando, bloques, tipoProgramacion, estaConectado, enviarComando, hablar, hablarYEsperar, narrativa]);

  const leerPrograma = useCallback(async () => {
    if (bloques.length === 0) { hablar('El programa está vacío'); return; }

    controlRef.current?.detener(); // si ya estaba leyendo, empieza de nuevo
    const control = crearControl();
    controlRef.current = control;
    setLeyendo(true);

    try {
      await control.hasta(hablarYEsperar(narrativa.REVISARCODIGO));
      await control.hasta(esperar(1000));
      for (let i = 1; i < bloques.length && !control.detenido; i++) {
        const bloque = bloques[i];
        if (bloque.startsWith('Decir:')) continue;

        let mensajeAudio;
        if (esRepetir(bloque))          mensajeAudio = narrativa.LEERREPETIR(vecesRepetir(bloque));
        else if (bloque === FIN_REPETIR) mensajeAudio = narrativa.LEERFINREPETIR;
        else                             mensajeAudio = NARRATIVA_LEER[obtenerBloque(tipoProgramacion, bloque)?.nombre];

        if (mensajeAudio) await control.hasta(hablarYEsperar(mensajeAudio));
        await control.hasta(esperar(2000));
      }
      if (control.detenido) {
        if (control.porUsuario) hablar(narrativa.LECTURADETENIDA);
      } else if (hayRepetirAbierto(bloques)) {
        await control.hasta(hablarYEsperar(narrativa.FALTAFINREPETIR));
      }
    } finally {
      if (controlRef.current === control) controlRef.current = null;
      setLeyendo(false);
    }
  }, [bloques, tipoProgramacion, hablar, hablarYEsperar, narrativa]);

  return {
    bloques,
    ejecutando,
    leyendo,
    indiceActual,
    pasoActual,
    esperandoVeces,
    parar,
    agregarBloque,
    elegirVeces,
    cancelarRepetir,
    eliminarUltimoBloque,
    limpiarBloques,
    ejecutarPrograma,
    leerPrograma,
  };
}
