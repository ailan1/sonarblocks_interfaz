import React from "react";
import Bloque from "./Bloque";

const CategoriasBloques = ({ onAgregarBloque, categoriasBloques, deshabilitado, categoriaSeleccionada, modoNavegacion, activa }) => {
  return (
    <div className={`paleta-bloques seccion ${activa ? 'seccion-activa' : ''}`}>
      <h2>Bloques Disponibles</h2>

      {modoNavegacion === 'navegacion-paleta' && (
        <div className="modo-navegacion-activo">
          <strong>Modo Navegación Activado</strong>
        </div>
      )}

      {categoriasBloques.map((categoria, catIndex) => (
        <div
          key={categoria.nombre}
          className={`categoria-bloques ${catIndex === categoriaSeleccionada ? 'categoria-seleccionada' : ''}`}
        >
          <h3 className={catIndex === categoriaSeleccionada ? 'texto-seleccionado' : ''}>
            {catIndex === categoriaSeleccionada && <span aria-hidden="true">▶ </span>}
            {categoria.nombre}
          </h3>
          {categoria.bloques.map((bloque, bloqIndex) => (
            <Bloque
              key={bloqIndex}
              texto={bloque.nombre}
              color={bloque.color}
              icono={bloque.icono}
              tecla={bloque.tecla}
              onClick={() => onAgregarBloque(bloque.nombre)}
              esArrastrable={true}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoriasBloques;
