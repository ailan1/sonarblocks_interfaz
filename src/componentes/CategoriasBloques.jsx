import React from "react";
import Bloque from "./Bloque";
import Icono from "./Icono";

// Solo la categoría elegida muestra sus bloques: es la misma en la que
// funcionan los números del teclado. Las demás muestran su nombre y los
// íconos de sus bloques, y se abren con las flechas o con un clic.
const CategoriasBloques = ({
  onAgregarBloque,
  categoriasBloques,
  categoriaSeleccionada,
  onSeleccionarCategoria,
  modoNavegacion,
  activa,
}) => {
  return (
    <div className={`paleta-bloques seccion ${activa ? 'seccion-activa' : ''}`}>
      <h2>Bloques Disponibles</h2>

      {modoNavegacion === 'navegacion-paleta' && (
        <div className="modo-navegacion-activo">
          <strong>Modo Navegación Activado</strong>
        </div>
      )}

      {categoriasBloques.map((categoria, catIndex) => {
        const abierta = catIndex === categoriaSeleccionada;
        return (
          <div
            key={categoria.nombre}
            className={`categoria-bloques ${abierta ? 'categoria-seleccionada' : ''}`}
          >
            <h3>
              <button
                className={`categoria-titulo ${abierta ? 'texto-seleccionado' : ''}`}
                onClick={() => onSeleccionarCategoria(catIndex)}
                aria-expanded={abierta}
              >
                <Icono nombre={abierta ? 'abierta' : 'cerrada'} size={18} className="categoria-flecha" />
                <span className="categoria-nombre">{categoria.nombre}</span>
                {!abierta && (
                  <span className="categoria-iconos">
                    {categoria.bloques.map((b) => <Icono key={b.nombre} nombre={b.icono} size={18} />)}
                  </span>
                )}
              </button>
            </h3>

            {abierta && categoria.bloques.map((bloque, bloqIndex) => (
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
        );
      })}
    </div>
  );
};

export default CategoriasBloques;
