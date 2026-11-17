import React from 'react';
import CYT from '../CYT.png';
import ControlVelocidad from './ControlVelocidad';
import ControlContraste from './ControlContraste';
import Icono from './Icono';
import '../estilos/BarraSuperior.css';

// Link al formulario de Google para que nos dejen su opinión
const URL_FORMULARIO_FEEDBACK = 'https://docs.google.com/forms/d/e/1FAIpQLSeXohaJOSqyhhHRztCVquF9LgHngM2c0P5Y4f3lPykf-jon-w/viewform';

const NOMBRES_SECCION = {
  'categorias':   'Categorías',
  'area-trabajo': 'Área de trabajo',
  'ejecucion':    'Ejecución',
  'ajustes':      'Ajustes',
  'conexion':     'Robot',
};

const BarraSuperior = ({
  tipoProgramacion,
  onConectar,
  estadoConexion,
  estaConectado,
  ejecutando,
  modoNavegacion,
  seccionActiva,
  etiquetaTema,
  onCambiarTema,
  etiquetaVelocidad,
  onCambiarVelocidad,
}) => {
  // Los mensajes de voz de la conexión los dice conectarMicrobit (igual con la tecla C)
  const manejarConectar = () => onConectar();

  return (
    <header className="barra-superior">
      <div className="logo-aplicacion">
        <span className="titulo-app">SonarBlocks</span>
        <img className="logo-cyt" src={CYT} alt="Logo CYT" />
        <a
          className="link-feedback"
          href={URL_FORMULARIO_FEEDBACK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dar tu opinión. Abre un formulario en una pestaña nueva"
        >
          <Icono nombre="opinion" size={16} strokeWidth={2.5} /> Opinión
        </a>
      </div>

      <div className="controles-barra">
        {/* Indicador de sección activa — ayuda visual para usuarios videntes */}
        {seccionActiva && (
          <span className="indicador-seccion" aria-live="polite">
            {NOMBRES_SECCION[seccionActiva]}
          </span>
        )}

        <div className={`grupo-barra ${seccionActiva === 'ajustes' ? 'seccion-activa' : ''}`}>
          <ControlVelocidad etiqueta={etiquetaVelocidad} onCambiar={onCambiarVelocidad} />
          <ControlContraste etiqueta={etiquetaTema} onCambiar={onCambiarTema} />
        </div>

        <div className={`grupo-barra ${seccionActiva === 'conexion' ? 'seccion-activa' : ''}`}>
          <button
            className="btn-barra btn-conectar"
            onClick={manejarConectar}
            disabled={ejecutando}
            aria-label={`Conectar al robot. Estado: ${estadoConexion || 'desconectado'}. Atajo de teclado: C`}
          >
            <span className="btn-texto">
              <Icono nombre={estaConectado ? 'conectado' : 'bluetooth'} /> {estadoConexion || 'Conectar'}
            </span>
            <span className="btn-atajo">Presioná C</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default BarraSuperior;
