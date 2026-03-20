import React, { useEffect } from "react";
// Importa tus dependencias reales aquí
import CYT from "../CYT.png"; 
import { useAudio } from "../hooks/useAudio";
import './BarraSuperior.css'; // Asegúrate de importar el CSS

const BarraSuperior = ({ 
  tipoProgramacion, 
  onConectar, 
  estadoConexion, 
  ejecutando,
  modoNavegacion
}) => {
  const { hablar, hablarYEsperar, narrativa,pararAudio } = useAudio();
  
  useEffect(() => {
    const manejarTeclado = (event) => {
      const tecla = event.key.toLowerCase();

      if (tecla === 'c' && !ejecutando) {
        hablarYEsperar(narrativa.INTRUCCIONESCONECTAR);
        onConectar();
      }
      if (tecla === 'tab') {
        hablar("Ahora presione la flecha para abajo");
      }
      if (tecla === 'arrowdown') {
        hablar("Seleccionando opciones, presiona Enter para confirmar");
      }
    };

    window.addEventListener("keydown", manejarTeclado);
    return () => window.removeEventListener("keydown", manejarTeclado);
  }, [onConectar, ejecutando, hablar, hablarYEsperar]);

  return (
    <header className="barra-superior">
      <div className="logo-aplicacion">
        <span className="titulo-app">SonarBlocks</span>
        <img className="logo-cyt" src={CYT} alt="Logo CYT" />
      </div>
      
      <div className="controles-barra">
        <button 
          className="btn-conectar" 
          onClick={() => {
            pararAudio()
            hablar(narrativa.ROBOBITCONECTADO);
            onConectar();
          }} 
          disabled={ejecutando}
          aria-label="Conectar al robot. Atajo de teclado: C"
        >
          <span className="btn-texto">🔌 {estadoConexion || "Conectar"}</span>
          <span className="btn-atajo">Presiona 'C'</span>
        </button>
      </div>
    </header>
  );
};

export default BarraSuperior;