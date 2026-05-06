import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '../hooks/useAudio';
import '../estilos/Onboarding.css';

const PASOS = [
  {
    tipo: 'cualquier-tecla',
    icono: '👋',
    titulo: '¡Bienvenido a SonarBlocks!',
    descripcion: 'Esta app te ayuda a programar un robot usando bloques. Apretá cualquier tecla para comenzar.',
    audio: '¡Hola! Bienvenido a SonarBlocks. Esta aplicación te ayuda a programar un robot usando bloques. Apretá cualquier tecla para comenzar el tutorial.',
    instruccion: 'Apretá cualquier tecla',
    teclaLabel: 'cualquier tecla',
  },
  {
    tipo: 'tecla',
    icono: '🗂️',
    titulo: 'La tecla TAB',
    descripcion: 'La tecla TAB te mueve entre las partes de la aplicación. ¡Apretala!',
    audio: 'La tecla Tab te mueve entre las partes de la aplicación. ¡Apretala!',
    instruccion: '¡Apretá TAB!',
    teclaEsperada: 'Tab',
    teclaLabel: 'TAB',
    audioError: '¡Esa no es! Apretá la tecla Tab.',
    audioExito: '¡Genial! Con Tab te movés entre las secciones.',
  },
  {
    tipo: 'tecla',
    icono: '⌨️',
    titulo: 'La tecla ENTER',
    descripcion: 'La tecla ENTER la vas a usar todo el tiempo. ¡Apretala ahora!',
    audio: 'La tecla Enter la vas a usar todo el tiempo. ¡Apretala ahora!',
    instruccion: '¡Apretá ENTER!',
    teclaEsperada: 'Enter',
    teclaLabel: 'ENTER',
    audioError: '¡Esa no es! Apretá la tecla Enter.',
    audioExito: '¡Muy bien! Esa es la tecla Enter.',
  },
  {
    tipo: 'info',
    icono: '🧩',
    titulo: '¿Qué son los bloques?',
    descripcion: 'Los bloques son las instrucciones que le das al robot. Cada categoría tiene bloques numerados. Apretás el número y se agrega al programa.',
    audio: 'Los bloques son las instrucciones que le das al robot. Cada categoría tiene bloques numerados. Apretás el número y se agrega al programa. Apretá Enter para seguir.',
    instruccion: 'Apretá ENTER para continuar',
  },
  {
    tipo: 'tecla',
    icono: '⬇️',
    titulo: 'Flecha ABAJO',
    descripcion: 'Con la flecha abajo pasás a la siguiente categoría de bloques. ¡Apretala!',
    audio: 'Con la flecha abajo pasás a la siguiente categoría de bloques. ¡Apretala ahora!',
    instruccion: 'Apretá ↓',
    teclaEsperada: 'ArrowDown',
    teclaLabel: '↓',
    audioError: '¡Esa no es! Apretá la flecha que va hacia abajo.',
    audioExito: '¡Excelente! Así bajás entre las categorías.',
  },
  {
    tipo: 'tecla',
    icono: '⬆️',
    titulo: 'Flecha ARRIBA',
    descripcion: 'Con la flecha arriba volvés a la categoría anterior. ¡Apretala!',
    audio: 'Con la flecha arriba volvés a la categoría anterior. ¡Apretala ahora!',
    instruccion: 'Apretá ↑',
    teclaEsperada: 'ArrowUp',
    teclaLabel: '↑',
    audioError: '¡Esa no es! Apretá la flecha que va hacia arriba.',
    audioExito: '¡Muy bien! Ya sabés moverte entre las categorías.',
  },
  {
    tipo: 'tecla',
    icono: '🟢',
    titulo: 'Agregá el bloque Al empezar',
    descripcion: 'Estás en la categoría Inicio. Apretá 1 para agregar el bloque "Al empezar".',
    audio: 'Estás en la categoría Inicio. Apretá el número 1 para agregar el bloque Al empezar. Este bloque es el inicio de todo programa.',
    instruccion: 'Apretá 1',
    teclaEsperada: '1',
    teclaLabel: '1',
    audioError: '¡Esa no es! Apretá el número 1.',
    audioExito: '¡Perfecto! Agregaste el bloque Al empezar.',
    accion: 'agregar',
    bloque: 'Al empezar',
  },
  {
    tipo: 'tecla',
    icono: '⬇️',
    titulo: 'Ir a Movimiento',
    descripcion: 'Ahora bajá a la categoría Movimiento con la flecha abajo.',
    audio: 'Muy bien. Ahora apretá la flecha abajo para ir a la categoría Movimiento.',
    instruccion: 'Apretá ↓',
    teclaEsperada: 'ArrowDown',
    teclaLabel: '↓',
    audioError: '¡Esa no es! Apretá la flecha hacia abajo.',
    audioExito: '¡Bien! Ahora estás en Movimiento.',
  },
  {
    tipo: 'tecla',
    icono: '🔵',
    titulo: 'Agregá Avanzar',
    descripcion: 'Estás en Movimiento. Apretá 1 para agregar el bloque Avanzar.',
    audio: 'Estás en la categoría Movimiento. Apretá 1 para agregar el bloque Avanzar.',
    instruccion: 'Apretá 1',
    teclaEsperada: '1',
    teclaLabel: '1',
    audioError: '¡Esa no es! Apretá el número 1.',
    audioExito: '¡Genial! El robot va a avanzar.',
    accion: 'agregar',
    bloque: 'Avanzar',
  },
  {
    tipo: 'tecla',
    icono: '🟣',
    titulo: 'Agregá Izquierda',
    descripcion: 'Apretá 2 para agregar el bloque Izquierda.',
    audio: 'Ahora apretá 2 para agregar el bloque Izquierda.',
    instruccion: 'Apretá 2',
    teclaEsperada: '2',
    teclaLabel: '2',
    audioError: '¡Esa no es! Apretá el número 2.',
    audioExito: '¡Muy bien! El robot va a girar a la izquierda.',
    accion: 'agregar',
    bloque: 'Izquierda',
  },
  {
    tipo: 'tecla',
    icono: '🟣',
    titulo: 'Agregá Derecha',
    descripcion: 'Apretá 3 para agregar el bloque Derecha.',
    audio: 'Ahora apretá 3 para agregar el bloque Derecha.',
    instruccion: 'Apretá 3',
    teclaEsperada: '3',
    teclaLabel: '3',
    audioError: '¡Esa no es! Apretá el número 3.',
    audioExito: '¡Excelente! El robot va a girar a la derecha.',
    accion: 'agregar',
    bloque: 'Derecha',
  },
  {
    tipo: 'tecla',
    icono: '⬇️',
    titulo: 'Ir a Acciones',
    descripcion: 'Bajá a la categoría Acciones con la flecha abajo.',
    audio: 'Muy bien. Apretá la flecha abajo para ir a la categoría Acciones.',
    instruccion: 'Apretá ↓',
    teclaEsperada: 'ArrowDown',
    teclaLabel: '↓',
    audioError: '¡Esa no es! Apretá la flecha hacia abajo.',
    audioExito: '¡Bien! Ahora estás en Acciones.',
  },
  {
    tipo: 'tecla',
    icono: '🟡',
    titulo: 'Agregá Esperar',
    descripcion: 'Estás en Acciones. Apretá 1 para agregar el bloque Esperar.',
    audio: 'Estás en la categoría Acciones. Apretá 1 para agregar el bloque Esperar.',
    instruccion: 'Apretá 1',
    teclaEsperada: '1',
    teclaLabel: '1',
    audioError: '¡Esa no es! Apretá el número 1.',
    audioExito: '¡Perfecto! El robot va a esperar un momento.',
    accion: 'agregar',
    bloque: 'Esperar',
  },
  {
    tipo: 'info',
    icono: '🔌',
    titulo: 'Conectar el robot',
    descripcion: 'Antes de ejecutar hay que conectar el robot. Apretá ENTER para continuar.',
    audio: 'Muy bien. Ya armaste tu primer programa. Ahora hay que conectar el robot. En el siguiente paso te explico cómo. Apretá Enter para continuar.',
    instruccion: 'Apretá ENTER para continuar',
  },
  {
    tipo: 'conectar',
    icono: '🤖',
    titulo: 'Conectá el robot',
    descripcion: 'Apretá C para conectar el robot, o TAB si no tenés el robot ahora.',
    audio: 'Apretá la letra C para conectar el robot. Se va a abrir una ventana del navegador. Dentro de esa ventana, usá Tab para moverte, la flecha abajo para bajar en la lista hasta encontrar tu robot, y Enter para conectarlo. Cuando se conecte, el tutorial va a seguir solo. Si no tenés el robot ahora, apretá Tab para saltear este paso.',
    instruccion: 'Apretá C para conectar o TAB para saltear',
    teclaLabel: 'C',
  },
  {
    tipo: 'info',
    icono: '▶️',
    titulo: 'Ejecutar el programa',
    descripcion: 'Con el robot conectado, apretás "Ejecutar" y el robot hace todo lo que programaste.',
    audio: 'Perfecto. Con el robot conectado, apretás el botón Ejecutar y el robot hace todo lo que programaste. Apretá Enter para continuar.',
    instruccion: 'Apretá ENTER para continuar',
  },
  {
    tipo: 'tecla',
    icono: '🏆',
    titulo: '¡Lo lograste!',
    descripcion: '¡Ya programaste tu primer robot! Conectalo y apretá Ejecutar para verlo en acción.',
    audio: '¡Felicitaciones! Ya programaste tu primer robot. Tenés los bloques Al empezar, Avanzar, Izquierda, Derecha y Esperar listos. Conectá el robot, apretá Ejecutar y mirá lo que hace. Apretá Enter para cerrar el tutorial y empezar.',
    instruccion: '¡Apretá ENTER para empezar!',
    teclaEsperada: 'Enter',
    teclaLabel: 'ENTER',
    audioError: 'Apretá Enter para terminar.',
    audioExito: '¡Vamos! ¡A programar el robot!',
  },
];

const Onboarding = ({ onTerminar, onAgregarBloque, limpiarBloques, conectarMicrobit, estaConectado }) => {
  const { hablarYEsperar, pararAudio, desbloquearAudio } = useAudio();

  const [fase, setFase]                     = useState('bienvenida');
  const [pasoActual, setPasoActual]         = useState(0);
  const [estado, setEstado]                 = useState('esperando');
  const [saliendo, setSaliendo]             = useState(false);
  const [estadoConectar, setEstadoConectar] = useState('esperando');

  // bloqueadoRef: true mientras habla o mientras espera timeout post-tecla
  const bloqueadoRef  = useRef(false);
  const pasoRef       = useRef(0);
  const faseRef       = useRef('bienvenida');

  useEffect(() => { pasoRef.current = pasoActual; }, [pasoActual]);
  useEffect(() => { faseRef.current = fase;        }, [fase]);

  // narrarPaso: espera que termine el audio y recién entonces desbloquea el teclado
  const narrarPaso = useCallback(async (indice) => {
    bloqueadoRef.current = true;
    await hablarYEsperar(PASOS[indice].audio);
    // Solo desbloquear si seguimos en el mismo paso (no hubo salto externo)
    if (pasoRef.current === indice && faseRef.current === 'tutorial') {
      bloqueadoRef.current = false;
    }
  }, [hablarYEsperar]);

  const avanzarPaso = useCallback(() => {
    const siguiente = pasoRef.current + 1;
    if (siguiente >= PASOS.length) {
      setSaliendo(true);
      localStorage.setItem('onboarding_visto', 'true');
      setTimeout(() => onTerminar(), 600);
    } else {
      setEstado('esperando');
      setEstadoConectar('esperando');
      setPasoActual(siguiente);
      narrarPaso(siguiente);
    }
  }, [onTerminar, narrarPaso]);

  // Cuando estaConectado cambia a true en el paso conectar, avanzamos
  useEffect(() => {
    if (
      estaConectado &&
      faseRef.current === 'tutorial' &&
      PASOS[pasoRef.current]?.tipo === 'conectar'
    ) {
      setEstadoConectar('conectado');
      pararAudio();
      bloqueadoRef.current = true;
      hablarYEsperar('¡El robot está conectado! Muy bien.').then(() => avanzarPaso());
    }
  }, [estaConectado, hablarYEsperar, pararAudio, avanzarPaso]);

  const handleComenzar = useCallback(() => {
    desbloquearAudio();
    faseRef.current = 'tutorial';
    setFase('tutorial');
    setPasoActual(0);
    pasoRef.current = 0;
    setEstado('esperando');
    // narrarPaso bloquea el teclado hasta que termina el audio
    setTimeout(() => narrarPaso(0), 150);
  }, [desbloquearAudio, narrarPaso]);

  const handleSalir = useCallback(() => {
    pararAudio();
    setSaliendo(true);
    localStorage.setItem('onboarding_visto', 'true');
    setTimeout(() => onTerminar(), 600);
  }, [pararAudio, onTerminar]);

  const manejarTeclado = useCallback((e) => {
    if (faseRef.current === 'bienvenida') {
      handleComenzar();
      return;
    }

    if (e.key === 'Tab') e.preventDefault();

    // Bloqueado mientras habla — ignorar toda tecla
    if (bloqueadoRef.current) return;

    const paso = PASOS[pasoRef.current];

    // ── Info: solo Enter avanza, pero espera que termine el audio del paso siguiente ──
    if (paso.tipo === 'info') {
      if (e.key === 'Enter') avanzarPaso();
      return;
    }

    // ── Cualquier tecla avanza ──
    if (paso.tipo === 'cualquier-tecla') {
      avanzarPaso();
      return;
    }

    // ── Conectar ──
    if (paso.tipo === 'conectar') {
      if (e.key.toLowerCase() === 'c' && estadoConectar === 'esperando') {
        setEstadoConectar('conectando');
        bloqueadoRef.current = true;
        hablarYEsperar('Abriendo ventana de conexión. Usá Tab para moverte, flecha abajo para bajar en la lista, y Enter para conectar.')
          .then(() => { bloqueadoRef.current = false; });
        conectarMicrobit();
      }
      if (e.key === 'Tab' && estadoConectar !== 'conectado') {
        bloqueadoRef.current = true;
        hablarYEsperar('Salteando conexión. Podés conectar el robot más tarde apretando C.')
          .then(() => avanzarPaso());
      }
      return;
    }

    // ── Tecla específica ──
    const coincide = e.key.toLowerCase() === paso.teclaEsperada.toLowerCase();

    if (coincide) {
      bloqueadoRef.current = true;
      setEstado('exito');
      if (paso.accion === 'agregar' && paso.bloque) {
        onAgregarBloque(paso.bloque);
      }
      // Espera que termine el audio de éxito y recién avanza
      hablarYEsperar(paso.audioExito).then(() => avanzarPaso());
    } else {
      bloqueadoRef.current = true;
      setEstado('error');
      // Espera que termine el audio de error y desbloquea para que reintente
      hablarYEsperar(paso.audioError).then(() => {
        if (faseRef.current === 'tutorial') {
          setEstado('esperando');
          bloqueadoRef.current = false;
        }
      });
    }
  }, [handleComenzar, avanzarPaso, hablarYEsperar, pararAudio, onAgregarBloque, conectarMicrobit, estadoConectar]);

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, [manejarTeclado]);

  const progresoPct = (pasoActual / (PASOS.length - 1)) * 100;

  // ── Bienvenida ──────────────────────────────────────────────────────────
  if (fase === 'bienvenida') {
    return (
      <div
        className="onboarding-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Bienvenida a SonarBlocks"
      >
        <div className="onboarding-modal onboarding-bienvenida">
          <button
            className="onboarding-btn-cerrar"
            onClick={handleSalir}
            aria-label="Saltar tutorial y cerrar"
            title="Saltar tutorial"
          >✕</button>
          <div className="onboarding-icono" style={{ fontSize: '4rem' }}>🤖</div>
          <h2 className="onboarding-titulo">¡Bienvenido a SonarBlocks!</h2>
          <p className="onboarding-descripcion">
            Antes de empezar, vamos a hacer un tutorial corto para aprender a usar la app.
          </p>
          <button
            className="onboarding-btn-comenzar"
            onClick={handleComenzar}
            autoFocus
            aria-label="Comenzar tutorial. También podés presionar cualquier tecla."
          >
            ▶ Comenzar tutorial
          </button>
          <p className="onboarding-hint">También podés presionar cualquier tecla</p>
        </div>
      </div>
    );
  }

  // ── Tutorial ────────────────────────────────────────────────────────────
  const paso = PASOS[pasoActual];

  return (
    <div
      className={`onboarding-overlay ${saliendo ? 'onboarding-saliendo' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de bienvenida"
    >
      <div className="onboarding-modal">

        <button
          className="onboarding-btn-cerrar"
          onClick={handleSalir}
          aria-label="Saltar tutorial y cerrar"
          title="Saltar tutorial"
        >✕</button>

        <div className="onboarding-barra-wrap" aria-label={`Paso ${pasoActual + 1} de ${PASOS.length}`}>
          <div className="onboarding-barra-fondo">
            <div className="onboarding-barra-relleno" style={{ width: `${progresoPct}%` }} />
          </div>
          <p className="onboarding-progreso-texto">Paso {pasoActual + 1} de {PASOS.length}</p>
        </div>

        <div className="onboarding-contenido" key={pasoActual}>
          <div className="onboarding-icono">{paso.icono}</div>
          <h2 className="onboarding-titulo">{paso.titulo}</h2>
          <p className="onboarding-descripcion">{paso.descripcion}</p>

          {(paso.tipo === 'tecla' || paso.tipo === 'cualquier-tecla') && (
            <div className={`onboarding-zona-tecla estado-${estado}`} aria-live="assertive">
              <div className={`onboarding-tecla-visual tecla-${estado === 'esperando' ? 'espera' : estado}`}>
                <span className="onboarding-tecla-label">{paso.teclaLabel}</span>
              </div>
              <p className={`onboarding-feedback feedback-${estado}`}>
                {estado === 'esperando' && `👆 ${paso.instruccion}`}
                {estado === 'exito'     && '✅ ¡Muy bien!'}
                {estado === 'error'     && '❌ ¡Esa no es! Intentá de nuevo'}
              </p>
            </div>
          )}

          {paso.tipo === 'conectar' && (
            <div className="onboarding-zona-tecla" aria-live="assertive">
              <div className={`onboarding-tecla-visual tecla-${
                estadoConectar === 'conectado' ? 'exito' : 'espera'
              }`}>
                <span className="onboarding-tecla-label">C</span>
              </div>
              <p className={`onboarding-feedback feedback-${
                estadoConectar === 'conectado' ? 'exito' : 'esperando'
              }`}>
                {estadoConectar === 'esperando'  && '👆 Apretá C para conectar o TAB para saltear'}
                {estadoConectar === 'conectando' && '⏳ Esperando conexión...'}
                {estadoConectar === 'conectado'  && '✅ ¡Robot conectado!'}
              </p>
            </div>
          )}

          {paso.tipo === 'info' && (
            <div className="onboarding-instruccion-info">
              ⏎ {paso.instruccion}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;