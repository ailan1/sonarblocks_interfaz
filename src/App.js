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
import { useMicrobit } from './hooks/useMicrobit';
import { useTema } from './hooks/useTema';
import { useVelocidad } from './hooks/useVelocidad';

import RobotSimulador from './componentes/RobotSimulador';
import { obtenerBloquesPorModo, obtenerTeclasRapidas } from './datos/bloquesData';
import './estilos/Temas.css';
import './estilos/App.css';

function App() {
  const [tipoProgramacion] = useState('base');
  const [mostrarOnboarding, setMostrarOnboarding] = useState(
    () => localStorage.getItem('onboarding_visto') !== 'false'
  );

  const {
    conectarMicrobit,
    enviarComando,
    estadoConexion,
    estaConectado,
  } = useMicrobit();

  const { etiqueta: etiquetaTema, cambiarTema } = useTema();
  const { etiqueta: etiquetaVelocidad, cambiarVelocidad } = useVelocidad();

  const datosModoActual       = obtenerBloquesPorModo(tipoProgramacion);
  const teclasRapidasActuales = obtenerTeclasRapidas(tipoProgramacion);

  // ── useBloques recibe la instancia de microbit, no crea la suya ──────────
  const {
    bloques,
    ejecutando,
    leyendo,
    parar,
    indiceActual,
    pasoActual,
    esperandoVeces,
    agregarBloque,
    elegirVeces,
    cancelarRepetir,
    eliminarUltimoBloque,
    ejecutarPrograma,
    leerPrograma,
    limpiarBloques,
  } = useBloques(tipoProgramacion, { enviarComando, estaConectado });

  const { categoriaSeleccionada, modoNavegacion, seccionActiva, seleccionarCategoria } = useTeclado({
    tipoProgramacion,
    datosModoActual,
    ejecutando,
    deshabilitado: mostrarOnboarding,
    onAgregarBloque: agregarBloque,
    onEliminarUltimo: eliminarUltimoBloque,
    onEjecutar: ejecutarPrograma,
    onLeerPrograma: leerPrograma,
    onConectar: conectarMicrobit,
    onCambiarTema: cambiarTema,
    onCambiarVelocidad: cambiarVelocidad,
    estaConectado,
    esperandoVeces,
    onElegirVeces: elegirVeces,
    onCancelarRepetir: cancelarRepetir,
    onParar: parar,
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
          etiquetaVelocidad={etiquetaVelocidad}
          onCambiarVelocidad={cambiarVelocidad}
          etiquetaTema={etiquetaTema}
          onCambiarTema={cambiarTema}
        />
      )}
      <DndProvider backend={HTML5Backend}>
        <BarraSuperior
          tipoProgramacion={datosModoActual.nombre}
          onConectar={conectarMicrobit}
          estadoConexion={estadoConexion}
          estaConectado={estaConectado}
          ejecutando={ejecutando}
          modoNavegacion={modoNavegacion}
          seccionActiva={seccionActiva}
          etiquetaTema={etiquetaTema}
          onCambiarTema={cambiarTema}
          etiquetaVelocidad={etiquetaVelocidad}
          onCambiarVelocidad={cambiarVelocidad}
        />

        <div className="contenido-principal">
          <CategoriasBloques
            onAgregarBloque={agregarBloque}
            categoriasBloques={datosModoActual.categorias}
            teclasRapidas={teclasRapidasActuales}
            deshabilitado={ejecutando}
            categoriaSeleccionada={categoriaSeleccionada}
            onSeleccionarCategoria={seleccionarCategoria}
            modoNavegacion={modoNavegacion}
            activa={seccionActiva === 'categorias'}
          />

          <div className="area-programacion">
            <AreaTrabajo
              bloques={bloques}
              onAgregarBloque={agregarBloque}
              modo={tipoProgramacion}
              ejecutando={ejecutando}
              indiceActual={indiceActual}
              esperandoVeces={esperandoVeces}
              onElegirVeces={elegirVeces}
              onCancelarRepetir={cancelarRepetir}
              activa={seccionActiva === 'area-trabajo'}
            />

            <ControlesPrograma
              onEjecutar={ejecutarPrograma}
              onEliminarUltimo={eliminarUltimoBloque}
              onLeerPrograma={leerPrograma}
              onParar={parar}
              ejecutando={ejecutando}
              leyendo={leyendo}
              activa={seccionActiva === 'ejecucion'}
            />
          </div>

          <RobotSimulador
            bloques={bloques}
            ejecutando={ejecutando}
            pasoActual={pasoActual}
          />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;