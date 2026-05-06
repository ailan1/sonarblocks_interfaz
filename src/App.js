import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import BarraSuperior from './componentes/BarraSuperior';
import CategoriasBloques from './componentes/CategoriasBloques';
import AreaTrabajo from './componentes/AreaTrabajo';
import ControlesPrograma from './componentes/ControlesPrograma';
import Onboarding from './componentes/Onboarding';

import { useBloques } from './hooks/useBloques';
import { useTeclado } from './hooks/useTeclado';
import { useAudio } from './hooks/useAudio';
import { useMicrobit } from './hooks/useMicrobit';

import RobotSimulador from './componentes/RobotSimulador';
import { obtenerBloquesPorModo, obtenerTeclasRapidas } from './datos/bloquesData';
import './estilos/App.css';

function App() {
  const [tipoProgramacion] = useState('base');
  const [mostrarOnboarding, setMostrarOnboarding] = useState(
    () => localStorage.getItem('onboarding_visto') !== 'false'
  );

  const { hablar } = useAudio();

  // ── Una sola instancia de microbit para toda la app ──────────────────────
  const {
    conectarMicrobit,
    enviarComando,
    estadoConexion,
    estaConectado,
  } = useMicrobit();

  const datosModoActual       = obtenerBloquesPorModo(tipoProgramacion);
  const teclasRapidasActuales = obtenerTeclasRapidas(tipoProgramacion);

  // ── useBloques recibe la instancia de microbit, no crea la suya ──────────
  const {
    bloques,
    ejecutando,
    agregarBloque,
    eliminarUltimoBloque,
    ejecutarPrograma,
    leerPrograma,
    limpiarBloques,
  } = useBloques(tipoProgramacion, { enviarComando, estaConectado });

  const { categoriaSeleccionada, modoNavegacion, seccionActiva } = useTeclado({
    tipoProgramacion,
    datosModoActual,
    teclasRapidasActuales,
    ejecutando,
    deshabilitado: mostrarOnboarding,
    onAgregarBloque: agregarBloque,
    onEliminarUltimo: eliminarUltimoBloque,
    onEjecutar: ejecutarPrograma,
    onLeerPrograma: leerPrograma,
    onConectar: conectarMicrobit,
  });

  return (
    <div className="app">
      {mostrarOnboarding && (
        <Onboarding
          onTerminar={() => setMostrarOnboarding(false)}
          onAgregarBloque={agregarBloque}
          limpiarBloques={limpiarBloques}
          conectarMicrobit={conectarMicrobit}
          estaConectado={estaConectado}
        />
      )}
      <DndProvider backend={HTML5Backend}>
        <BarraSuperior
          tipoProgramacion={datosModoActual.nombre}
          onConectar={conectarMicrobit}
          estadoConexion={estadoConexion}
          ejecutando={ejecutando}
          modoNavegacion={modoNavegacion}
          seccionActiva={seccionActiva}
        />

        <div className="contenido-principal">
          <CategoriasBloques
            onAgregarBloque={agregarBloque}
            categoriasBloques={datosModoActual.categorias}
            teclasRapidas={teclasRapidasActuales}
            deshabilitado={ejecutando}
            categoriaSeleccionada={categoriaSeleccionada}
            modoNavegacion={modoNavegacion}
          />

          <div className="area-programacion">
            <AreaTrabajo
              bloques={bloques}
              onAgregarBloque={agregarBloque}
              modo={tipoProgramacion}
              ejecutando={ejecutando}
            />

            <ControlesPrograma
              bloques={bloques}
              onEjecutar={ejecutarPrograma}
              onEliminarUltimo={eliminarUltimoBloque}
              onLeerPrograma={leerPrograma}
              ejecutando={ejecutando}
            />
          </div>

          <RobotSimulador
            bloques={bloques}
            ejecutando={ejecutando}
          />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;