import React, { useEffect } from "react"; 
import { useDrop } from "react-dnd";
import Bloque from "./Bloque";
import { obtenerColorBloque } from '../datos/bloquesData';
import { useAudio } from "../hooks/useAudio";

const AreaTrabajo = ({ bloques, onAgregarBloque, modo, ejecutando }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BLOQUE",
    drop: (item) => onAgregarBloque(item.texto),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const { hablar,narrativa} = useAudio();
  

  return (
    <div 
      ref={drop} 
      className="area-trabajo"
      style={{
        backgroundColor: isOver ? '#e3f2fd' : '#f9f9f9',
        borderColor: isOver ? '#4C97FF' : '#ccc'
      }}
    >
      {bloques.length === 0 ? (
        <p className="mensaje-vacio">
          Arrastra bloques aquí o usa las teclas rápidas
        </p>
      ) : (
        bloques.map((bloque, idx) => (
          <Bloque
            key={idx}
            texto={bloque}
            color={obtenerColorBloque(modo, bloque.startsWith("Decir:") ? "Decir" : bloque)}
            estilo={{
              marginBottom: '10px',
              cursor: 'default'
            }}
            esArrastrable={true}
          />
        ))
      )}
    </div>
  );
};

export default AreaTrabajo;