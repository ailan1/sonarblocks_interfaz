import React, { useEffect, useMemo, useRef } from "react";
import { useDrop } from "react-dnd";
import Bloque from "./Bloque";
import Icono from "./Icono";
import { obtenerBloque, obtenerColorBloque } from '../datos/bloquesData';
import { MIN_VECES, MAX_VECES, indicesDentroDeRepetir } from '../utils/programa';

const NUMEROS_VECES = Array.from({ length: MAX_VECES - MIN_VECES + 1 }, (_, i) => MIN_VECES + i);

const AreaTrabajo = ({
  bloques,
  onAgregarBloque,
  modo,
  ejecutando,
  indiceActual,
  esperandoVeces,
  onElegirVeces,
  onCancelarRepetir,
  activa,
}) => {
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
  }, [bloques.length, esperandoVeces]);

  // Los bloques dentro de una repetición se muestran corridos a la derecha
  const dentro = useMemo(() => indicesDentroDeRepetir(bloques), [bloques]);

  return (
    <div
      ref={(el) => { contenedorRef.current = el; drop(el); }}
      className={`area-trabajo seccion ${activa ? 'seccion-activa' : ''} ${isOver ? 'area-trabajo-soltar' : ''}`}
    >
      {bloques.length === 0 && !esperandoVeces ? (
        <p className="mensaje-vacio">
          Arrastra bloques aquí o usa las teclas rápidas
        </p>
      ) : (
        bloques.map((bloque, idx) => (
          <div
            key={idx}
            className={`fila-bloque ${dentro.has(idx) ? 'fila-dentro-repetir' : ''} ${ejecutando && idx === indiceActual ? 'fila-ejecutando' : ''}`}
          >
            <Bloque
              texto={bloque}
              color={obtenerColorBloque(modo, bloque.startsWith("Decir:") ? "Decir" : bloque)}
              icono={obtenerBloque(modo, bloque)?.icono}
              esArrastrable={false}
            />
            {ejecutando && idx === indiceActual && (
              <Icono nombre="actual" size={28} className="marca-ejecutando" />
            )}
          </div>
        ))
      )}

      {/* Elegir cuántas veces repetir: con el teclado (2 a 9) o con estos botones */}
      {esperandoVeces && (
        <div className="panel-veces" role="group" aria-label="¿Cuántas veces repetir?">
          <p className="panel-veces-titulo">
            <Icono nombre="repetir" size={20} /> ¿Cuántas veces repetir? Apretá un número del 2 al 9
          </p>
          <div className="panel-veces-botones">
            {NUMEROS_VECES.map((n) => (
              <button key={n} className="btn-veces" onClick={() => onElegirVeces(n)}>{n}</button>
            ))}
            <button className="btn-veces btn-veces-cancelar" onClick={onCancelarRepetir}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaTrabajo;
