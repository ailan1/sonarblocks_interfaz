import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio, NARRATIVA } from './useAudio';

// 'conexion' va al final: no cambia el orden que los chicos ya conocen,
// y desde Categorías queda a un solo Shift+Tab
const SECCIONES = ['categorias', 'area-trabajo', 'ejecucion', 'ajustes', 'conexion'];

// Narrativa por nombre de categoría
const NARRATIVA_CATEGORIAS = {
  'Inicio':     NARRATIVA.INICIO,
  'Movimiento': NARRATIVA.MOVIMIENTO,
  'Acciones':   NARRATIVA.ACCIONES,
  'Repetir':    NARRATIVA.REPETIR,
  'Luces':      NARRATIVA.LUCES,
};

// Feedback auditivo por sección (Tab)
const NARRATIVA_SECCIONES = {
  'categorias':   'Sección Categorías. Usá las flechas para moverte entre categorías, y el número de cada bloque para agregarlo.',
  'area-trabajo': 'Sección Área de trabajo. Aquí se muestra tu programa actual.',
  'ejecucion':    'Sección Ejecución. Presioná Espacio para ejecutar, Escape para parar, L para leer el programa, o Retroceso para borrar el último bloque.',
  'ajustes':      'Sección Ajustes. Presioná V para cambiar la velocidad de la voz, o T para cambiar los colores de la pantalla.',
};

export function useTeclado({
  tipoProgramacion,
  datosModoActual,
  ejecutando,
  deshabilitado,
  onAgregarBloque,
  onEliminarUltimo,
  onEjecutar,
  onLeerPrograma,
  onConectar,
  onCambiarTema,
  onCambiarVelocidad,
  estaConectado,
  esperandoVeces,
  onElegirVeces,
  onCancelarRepetir,
  onParar,
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [seccionActiva, setSeccionActiva]   = useState('categorias');
  const [modoNavegacion, setModoNavegacion] = useState('teclas-rapidas');

  const { hablar, repetirUltimo, narrativa } = useAudio();

  // ── Refs para valores que cambian pero no deben re-registrar el listener ──
  const seccionRef          = useRef(seccionActiva);
  const categoriaRef        = useRef(categoriaSeleccionada);
  const datosModoRef        = useRef(datosModoActual);
  const estaConectadoRef    = useRef(estaConectado);
  const esperandoVecesRef   = useRef(esperandoVeces);

  // ── Refs para callbacks — evitan stale closures en el listener ────────────
  const onAgregarBloqueRef  = useRef(onAgregarBloque);
  const onEliminarUltimoRef = useRef(onEliminarUltimo);
  const onEjecutarRef       = useRef(onEjecutar);
  const onLeerProgramaRef   = useRef(onLeerPrograma);
  const onConectarRef       = useRef(onConectar);
  const onCambiarTemaRef    = useRef(onCambiarTema);
  const onCambiarVelocidadRef = useRef(onCambiarVelocidad);
  const onElegirVecesRef    = useRef(onElegirVeces);
  const onCancelarRepetirRef = useRef(onCancelarRepetir);
  const onPararRef          = useRef(onParar);

  useEffect(() => { seccionRef.current          = seccionActiva;         }, [seccionActiva]);
  useEffect(() => { categoriaRef.current        = categoriaSeleccionada; }, [categoriaSeleccionada]);
  useEffect(() => { datosModoRef.current        = datosModoActual;       }, [datosModoActual]);
  useEffect(() => { estaConectadoRef.current    = estaConectado;         }, [estaConectado]);
  useEffect(() => { esperandoVecesRef.current   = esperandoVeces;        }, [esperandoVeces]);
  useEffect(() => { onAgregarBloqueRef.current  = onAgregarBloque;       }, [onAgregarBloque]);
  useEffect(() => { onEliminarUltimoRef.current = onEliminarUltimo;      }, [onEliminarUltimo]);
  useEffect(() => { onEjecutarRef.current       = onEjecutar;            }, [onEjecutar]);
  useEffect(() => { onLeerProgramaRef.current   = onLeerPrograma;        }, [onLeerPrograma]);
  useEffect(() => { onConectarRef.current       = onConectar;            }, [onConectar]);
  useEffect(() => { onCambiarTemaRef.current    = onCambiarTema;         }, [onCambiarTema]);
  useEffect(() => { onCambiarVelocidadRef.current = onCambiarVelocidad;  }, [onCambiarVelocidad]);
  useEffect(() => { onElegirVecesRef.current    = onElegirVeces;         }, [onElegirVeces]);
  useEffect(() => { onCancelarRepetirRef.current = onCancelarRepetir;    }, [onCancelarRepetir]);
  useEffect(() => { onPararRef.current          = onParar;               }, [onParar]);

  // Elegir categoría con el mouse (clic en su nombre): mismo efecto que las flechas
  const seleccionarCategoria = useCallback((indice) => {
    categoriaRef.current = indice;
    seccionRef.current   = 'categorias';
    setCategoriaSeleccionada(indice);
    setSeccionActiva('categorias');
    const msg = NARRATIVA_CATEGORIAS[datosModoRef.current.categorias[indice]?.nombre];
    if (msg) hablar(msg);
  }, [hablar]);

  useEffect(() => {
    const manejarTecla = (e) => {
      if (deshabilitado) return;
      if (ejecutando && e.key !== 'Escape') return;
      const tecla = e.key.toLowerCase();

      // ── ELEGIR CUÁNTAS VECES REPETIR (después de agregar "Repetir") ───────
      // Mientras tanto solo valen los números 2 a 9, Retroceso/Escape y R.
      if (esperandoVecesRef.current) {
        e.preventDefault();
        if (/^[2-9]$/.test(tecla))                    onElegirVecesRef.current?.(Number(tecla));
        else if (tecla === 'backspace' || tecla === 'escape') onCancelarRepetirRef.current?.();
        else if (tecla === 'r')                       repetirUltimo();
        else                                          hablar(NARRATIVA.SOLONUMEROS);
        return;
      }

      // ── ESCAPE: para la ejecución o la lectura del programa ───────────────
      // (es la única tecla que funciona mientras se ejecuta)
      if (tecla === 'escape') { onPararRef.current?.(); return; }

      // ── TAB: navega entre secciones lógicas ──────────────────────────────
      if (e.key === 'Tab' && tipoProgramacion !== '') {
        e.preventDefault();
        setModoNavegacion('navegacion-secciones');
        const total     = SECCIONES.length;
        const idxActual = SECCIONES.indexOf(seccionRef.current);
        const siguiente = e.shiftKey
          ? (idxActual - 1 + total) % total
          : (idxActual + 1) % total;

        const nuevaSeccion = SECCIONES[siguiente];
        seccionRef.current = nuevaSeccion;
        setSeccionActiva(nuevaSeccion);

        // Un solo mensaje: si se dijeran por separado, el segundo cortaría al primero
        let mensaje = NARRATIVA_SECCIONES[nuevaSeccion];
        if (nuevaSeccion === 'categorias') {
          const cat = datosModoRef.current.categorias[categoriaRef.current];
          const msgCategoria = cat ? NARRATIVA_CATEGORIAS[cat.nombre] : null;
          if (msgCategoria) mensaje += ` ${msgCategoria}`;
        }
        // Robot: el mensaje depende de si está conectado
        if (nuevaSeccion === 'conexion') {
          mensaje = estaConectadoRef.current
            ? NARRATIVA.SECCIONROBOTCONECTADO
            : NARRATIVA.SECCIONROBOTDESCONECTADO;
        }
        // Antes de ejecutar, recordar si falta conectar el robot
        if (nuevaSeccion === 'ejecucion' && !estaConectadoRef.current) {
          mensaje += ` ${NARRATIVA.RECORDARCONECTAR}`;
        }
        hablar(mensaje);
        return;
      }

      // ── FLECHAS: cambian categoría (solo en sección "categorias") ─────────
      if (seccionRef.current === 'categorias') {
        const esSiguiente = e.key === 'ArrowDown' || e.key === 'ArrowRight';
        const esAnterior  = e.key === 'ArrowUp'   || e.key === 'ArrowLeft';
        if (esSiguiente || esAnterior) {
          e.preventDefault();
          const total  = datosModoRef.current.categorias.length;
          const nueva  = esSiguiente
            ? (categoriaRef.current + 1) % total
            : (categoriaRef.current - 1 + total) % total;
          categoriaRef.current = nueva;
          setCategoriaSeleccionada(nueva);
          const msg = NARRATIVA_CATEGORIAS[datosModoRef.current.categorias[nueva].nombre];
          if (msg) hablar(msg);
          return;
        }
      }

      // ── ACCIONES GLOBALES (cualquier sección) ─────────────────────────────
      if (tecla === ' ')         { e.preventDefault(); onEjecutarRef.current?.();       return; }
      if (tecla === 'l')         { onLeerProgramaRef.current?.();                       return; }
      if (tecla === 'backspace') { onEliminarUltimoRef.current?.();                     return; }
      if (tecla === 'r')         { repetirUltimo();                                     return; }
      if (tecla === 'c')         { onConectarRef.current?.();                           return; }
      if (tecla === 't')         { onCambiarTemaRef.current?.();                        return; }
      if (tecla === 'v')         { onCambiarVelocidadRef.current?.();                   return; }
      if (tecla === 'h')         { hablar(narrativa.CATEGORIAS);                        return; }

      // ── AGREGAR BLOQUES (solo desde sección "categorias") ─────────────────
      if (seccionRef.current !== 'categorias') return;

      const catActual = datosModoRef.current.categorias[categoriaRef.current];
      const bloqueEnCategoria = catActual?.bloques.find(
        (b) => b.tecla?.toLowerCase() === tecla
      );
      if (bloqueEnCategoria) { onAgregarBloqueRef.current?.(bloqueEnCategoria.nombre); return; }

      // Número que no está en esta categoría: avisar y recordar cuáles hay.
      // (Antes agregaba un bloque de otra categoría, y eso confundía.)
      if (/^[0-9]$/.test(tecla)) {
        const msgCategoria = NARRATIVA_CATEGORIAS[catActual?.nombre] || '';
        hablar(`${NARRATIVA.NOHAYBLOQUE(tecla)} ${msgCategoria}`);
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);

  }, [ejecutando, deshabilitado, tipoProgramacion, hablar, repetirUltimo, narrativa]); // hablar/repetirUltimo/narrativa nunca cambian

  return { categoriaSeleccionada, seccionActiva, modoNavegacion, seleccionarCategoria };
}