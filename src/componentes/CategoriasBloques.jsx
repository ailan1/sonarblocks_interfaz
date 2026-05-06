import React, { useEffect } from "react";
import Bloque from "./Bloque";
import { useAudio } from '../hooks/useAudio';

const CategoriasBloques = ({ onAgregarBloque, categoriasBloques, deshabilitado, categoriaSeleccionada, modoNavegacion }) => {
  const { hablar,hablarYEsperar,narrativa} = useAudio();


  return (
    <div className="paleta-bloques">
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
            {catIndex + 1}. {categoria.nombre}
          </h3>
          {categoria.bloques.map((bloque, bloqIndex) => (
            <Bloque
              key={bloqIndex}
              texto={bloque.nombre}
              color={bloque.color}
              onClick={() => onAgregarBloque(bloque.nombre)}
              esArrastrable={true}
              estilo={{
                border: catIndex === categoriaSeleccionada ? '2px solid #4C97FF' : 'none'
              }}
            />
          ))}
        </div>
      ))}
      
      
    </div>
  );
};

export default CategoriasBloques;