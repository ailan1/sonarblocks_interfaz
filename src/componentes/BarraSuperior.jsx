import React from 'react';
import CYT from '../CYT.png';
import { useAudio } from '../hooks/useAudio';
import ControlVelocidad from './ControlVelocidad';
import '../estilos/BarraSuperior.css';


const BarraSuperior = ({
  tipoProgramacion,
  onConectar,
  estadoConexion,
  ejecutando,
  modoNavegacion,
  seccionActiva,
}) => {
  const { hablar, pararAudio, narrativa } = useAudio();

  const manejarConectar = () => {
    pararAudio();
    hablar(narrativa.ROBOBITCONECTADO);
    onConectar();
  };

  return (
    <header className="barra-superior">
      <div className="logo-aplicacion">
        <span className="titulo-app">SonarBlocks</span>
        <img className="logo-cyt" src={CYT} alt="Logo CYT" />
      </div>

      <div className="controles-barra" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Indicador de sección activa — ayuda visual para usuarios videntes */}
        {seccionActiva && (
          <span
            aria-live="polite"
            style={{
              fontSize: '0.8rem',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '2px 10px',
            }}
          >
            {seccionActiva === 'categorias'   && 'Categorías'}
            {seccionActiva === 'area-trabajo' && 'Área de trabajo'}
            {seccionActiva === 'ejecucion'    && 'Ejecución'}
          </span>
        )}

        <ControlVelocidad />

        <button
          className="btn-conectar"
          onClick={manejarConectar}
          disabled={ejecutando}
          aria-label={`Conectar al robot. Estado: ${estadoConexion || 'desconectado'}. Atajo de teclado: C`}
        >
          <span className="btn-texto">🔌 {estadoConexion || 'Conectar'}</span>
          <span className="btn-atajo">Presioná C</span>
        </button>
      </div>
    </header>
  );
};

export default BarraSuperior;