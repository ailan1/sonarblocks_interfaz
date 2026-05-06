import { useState, useEffect, useRef } from 'react';
import { useAudio } from './useAudio';


const SECCIONES = ['categorias', 'area-trabajo', 'ejecucion'];

export function useTeclado({
  tipoProgramacion,
  datosModoActual,
  teclasRapidasActuales,
  ejecutando,
  deshabilitado,
  onAgregarBloque,
  onEliminarUltimo,
  onEjecutar,
  onLeerPrograma,
  onConectar,
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [seccionActiva, setSeccionActiva]   = useState('categorias');
  const [modoNavegacion, setModoNavegacion] = useState('teclas-rapidas');

  const { hablar, repetirUltimo, narrativa } = useAudio();

  // Ref para leer el valor actualizado dentro del closure del listener
  const seccionRef          = useRef(seccionActiva);
  const categoriaRef        = useRef(categoriaSeleccionada);
  const datosModoRef        = useRef(datosModoActual);
  const teclasRapidasRef    = useRef(teclasRapidasActuales);

  useEffect(() => { seccionRef.current       = seccionActiva;         }, [seccionActiva]);
  useEffect(() => { categoriaRef.current     = categoriaSeleccionada; }, [categoriaSeleccionada]);
  useEffect(() => { datosModoRef.current     = datosModoActual;       }, [datosModoActual]);
  useEffect(() => { teclasRapidasRef.current = teclasRapidasActuales; }, [teclasRapidasActuales]);

  // Narrativa por nombre de categoría
  const NARRATIVA_CATEGORIAS = {
    'Inicio':     narrativa.INICIO,
    'Movimiento': narrativa.MOVIMIENTO,
    'Acciones':   narrativa.ACCIONES,
  };

  // Feedback auditivo por sección (Tab)
  const NARRATIVA_SECCIONES = {
    'categorias':   'Sección Categorías. Usá las flechas para moverte entre categorías, y la letra indicada para agregar un bloque.',
    'area-trabajo': 'Sección Área de trabajo. Aquí se muestra tu programa actual.',
    'ejecucion':    'Sección Ejecución. Presioná Espacio para ejecutar, L para leer el programa, o Retroceso para borrar el último bloque.',
  };

  useEffect(() => {
   const manejarTecla = (e) => {
      if (deshabilitado) return;
      if (ejecutando && e.key !== 'Escape') return;
      const tecla = e.key.toLowerCase();

      // ── TAB: navega entre secciones lógicas ────────────────────────────
      if (e.key === 'Tab' && tipoProgramacion !== '') {
        e.preventDefault();
        setModoNavegacion('navegacion-secciones');
        const total    = SECCIONES.length;
        const idxActual = SECCIONES.indexOf(seccionRef.current);
        const siguiente = e.shiftKey
          ? (idxActual - 1 + total) % total
          : (idxActual + 1) % total;

        const nuevaSeccion = SECCIONES[siguiente];
        setSeccionActiva(nuevaSeccion);
        hablar(NARRATIVA_SECCIONES[nuevaSeccion]);

        if (nuevaSeccion === 'categorias') {
          const cat = datosModoRef.current.categorias[categoriaRef.current];
          const msg = cat ? NARRATIVA_CATEGORIAS[cat.nombre] : null;
          if (msg) hablar(msg);
        }
        return;
      }

      // ── FLECHAS: cambian categoría cuando la sección activa es "categorias" ─
      if (seccionRef.current === 'categorias') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          setCategoriaSeleccionada((prev) => {
            const sig = (prev + 1) % datosModoRef.current.categorias.length;
            const cat = datosModoRef.current.categorias[sig];
            const msg = NARRATIVA_CATEGORIAS[cat.nombre];
            if (msg) hablar(msg);
            return sig;
          });
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          setCategoriaSeleccionada((prev) => {
            const total = datosModoRef.current.categorias.length;
            const ant   = (prev - 1 + total) % total;
            const cat   = datosModoRef.current.categorias[ant];
            const msg   = NARRATIVA_CATEGORIAS[cat.nombre];
            if (msg) hablar(msg);
            return ant;
          });
          return;
        }
      }

      // ── ACCIONES GLOBALES (cualquier sección) ───────────────────────────
      if (tecla === ' ')         { e.preventDefault(); onEjecutar();            return; }
      if (tecla === 'l')         { onLeerPrograma();                            return; }
      if (tecla === 'backspace') { onEliminarUltimo();                          return; }
      if (tecla === 'r')         { repetirUltimo();                             return; }
      if (tecla === 'c' && onConectar) { onConectar();                         return; }
      if (tecla === 'h')         { hablar(narrativa.CATEGORIAS);                return; }

      // ── AGREGAR BLOQUES (solo desde sección "categorias") ───────────────
      if (seccionRef.current !== 'categorias') return;

      const catActual = datosModoRef.current.categorias[categoriaRef.current];
      const bloqueEnCategoria = catActual?.bloques.find(
        (b) => b.tecla?.toLowerCase() === tecla
      );
      if (bloqueEnCategoria) { onAgregarBloque(bloqueEnCategoria.nombre); return; }

      if (teclasRapidasRef.current[tecla]) {
        onAgregarBloque(teclasRapidasRef.current[tecla]);
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);

  },[ejecutando, deshabilitado, tipoProgramacion]);

  return { categoriaSeleccionada, seccionActiva, modoNavegacion };
}