import { createContext, useState, useEffect, useContext } from 'react';
import { useAudio } from './useAudio';
import { useMicrobit } from './useMicrobit';



const ProgramaContext = createContext();

export const usePrograma = () => {
  const context = useContext(ProgramaContext);
  if (!context) {
    throw new Error('usePrograma debe ser usado dentro de ProgramaProvider');
  }
  return context;
};

export const ProgramaProvider = ({ children }) => {
  const [bloques, setBloques] = useState([]);
  const { hablar,narrativa } = useAudio();
  const { enviarComando } = useMicrobit();

  const agregarBloque = (bloque) => {
    if (bloque === "Al empezar" && bloques.includes("Al empezar")) {
      hablar("Ya tienes una bandera de inicio");
      return;
    }
    
    setBloques((prev) => 
      bloque === "Al empezar" ? ["Al empezar", ...prev] : [...prev, bloque]
    );
    hablar(`Agregaste bloque ${bloque}`);
  };

  const eliminarUltimoBloque = () => {
    if (bloques.length > 0) {
      setBloques((prev) => prev.slice(0, -1));
      hablar("Bloque eliminado");
    } else {
      hablar("No hay bloques para borrar");
    }
  };

  const ejecutarPrograma = () => {
    if (!bloques[0] || bloques[0] !== "Al empezar") {
      hablar("Necesitas un bloque de inicio para comenzar");
      return;
    }
    
    if (bloques.length === 1) {
      hablar("Tu programa está vacío. Agrega más bloques");
      return;
    }

    hablar("Iniciando programa...");
    
    bloques.slice(1).forEach((bloque, i) => {
      setTimeout(() => {
        if (bloque.startsWith("Decir:")) {
          hablar(bloque.replace("Decir:", ""));
        } else {
          hablar(`Ejecutando ${bloque}`);
          enviarComando(bloque);
        }
      }, i * 1200);
    });
  };

 
  const value = {
    bloques,
    agregarBloque,
    eliminarUltimoBloque,
    ejecutarPrograma
  };

  return (
    <ProgramaContext.Provider value={value}>
      {children}
    </ProgramaContext.Provider>
  );
};