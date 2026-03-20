import React from "react";
import { useDrag } from "react-dnd";

const Bloque = ({ texto, color, onClick, estilo = {}, esArrastrable = true }) => {
  // Solo hacer arrastrable si está en la paleta
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BLOQUE",
    item: { texto },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: esArrastrable, // Solo arrastrable desde paleta
  }), [esArrastrable]);

  const esInicio = texto === "Al empezar";

  const estiloBase = {
    background: color,
    color: "white",
    padding: esInicio ? "14px 25px" : "12px 20px",
    borderRadius: esInicio ? "20px 20px 6px 6px" : "12px",
    fontWeight: "bold",
    fontSize: esInicio ? "1.2rem" : "1.1rem",
    margin: "8px 0",
    boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
    cursor: esArrastrable ? "move" : "default",
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    userSelect: "none",
    width: "280px",
  };

  return (
    <div
      ref={esArrastrable ? drag : null} // Solo hacer ref si es arrastrable
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick && onClick()}
      style={{ ...estiloBase, ...estilo }}
    >
      {texto}
      
      {/* Pestaña superior de encastre */}
      {!esInicio && (
        <div 
       
          style={{ 
            position: 'absolute',
            top: '-12px',
            left: '20px',
            width: '40px',
            height: '13px',
            background: color,
            borderRadius: '6px 6px 0 0'
          }} 
        />
      )}
      
      {/* Ranura inferior de encastre */}
      {!esInicio && (
        <div 
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '20px',
            width: '40px',
            height: '12px',
            background: '#f9f9f9',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
          }}
        />
      )}
    </div>
  );
};

export default Bloque;