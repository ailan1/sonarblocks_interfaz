import React from "react";
import { useDrag } from "react-dnd";
import { colorTextoPara } from "../datos/bloquesData";

const Bloque = ({ texto, color, icono, tecla, onClick, esArrastrable = true }) => {
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

  return (
    <div
      ref={esArrastrable ? drag : null} // Solo hacer ref si es arrastrable
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick && onClick()}
      className={`bloque ${esInicio ? "bloque-inicio" : ""}`}
      style={{
        background: color,
        color: colorTextoPara(color),
        cursor: esArrastrable ? "grab" : "default",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {icono && <span className="bloque-icono" aria-hidden="true">{icono}</span>}
      <span className="bloque-texto">{texto}</span>
      {tecla && (
        <span className="bloque-tecla" aria-label={`tecla ${tecla}`}>{tecla}</span>
      )}

      {/* Pestaña superior de encastre */}
      {!esInicio && <div className="pestana-superior" style={{ background: color }} />}

      {/* Ranura inferior de encastre */}
      {!esInicio && <div className="ranura-inferior" />}
    </div>
  );
};

export default Bloque;
