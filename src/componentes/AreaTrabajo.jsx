import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Bloque from "./Bloque";
import { obtenerBloque, obtenerColorBloque } from '../datos/bloquesData';

const AreaTrabajo = ({ bloques, onAgregarBloque, modo, ejecutando, activa }) => {
  // onAgregarBloque en las dependencias: sin eso, drop usaría la versión del
  // primer render y no sabría qué bloques ya hay (p. ej. "Al empezar" repetido)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BLOQUE",
    drop: (item) => onAgregarBloque(item.texto),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onAgregarBloque]);

  // Si el programa no entra, se baja solo hasta el último bloque agregado
  const contenedorRef = useRef(null);
  useEffect(() => {
    const el = contenedorRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bloques.length]);

  return (
    <div
      ref={(el) => { contenedorRef.current = el; drop(el); }}
      className={`area-trabajo seccion ${activa ? 'seccion-activa' : ''} ${isOver ? 'area-trabajo-soltar' : ''}`}
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
            icono={obtenerBloque(modo, bloque)?.icono}
            esArrastrable={false}
          />
        ))
      )}
    </div>
  );
};

export default AreaTrabajo;
