import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import BarraSuperior from './BarraSuperior';
import './SelectorModo.css';

import microbitBasicoImg from "../robobit.jpeg";
import microbitAutoImg from "../ubit.png";

const SelectorModo = ({ onSeleccionarModo ,ejecutar}) => {
  const { hablar, narrativa,pararAudio } = useAudio();
  const [indexSeleccionado, setIndexSeleccionado] = useState(0);

  const opciones = [
    { 
      id: 'base', 
      nombre: 'Robo:bit', 
      detalles: 'Bloques para mover tu MicroBit. Incluye movimientos simples.',
      imagen: microbitBasicoImg
    },
    { 
      id: 'auto', 
      nombre: 'uBit', 
      detalles: 'Bloques esenciales de MakeCode. Incluye sensores y eventos.',
      imagen: microbitAutoImg
    }
  ];

  useEffect(() => {
    hablar(narrativa.BIENVENIDA);
    localStorage.setItem("primeraVez", false);
  }, []);

  const manejarTeclado = (e) => {
    // Navegación TAB
    if (e.key === "Tab") {
      e.preventDefault();
      const siguiente = (indexSeleccionado + 1) % opciones.length;
      setIndexSeleccionado(siguiente);
      console.log(siguiente)
      const modo = opciones[siguiente];
      pararAudio()
      if(siguiente== 0) hablar(narrativa.MODOROBOBIT)
      if(siguiente== 1) hablar(narrativa.MODOUBIT)
    
    }

    // Entrar con ENTER
    if (e.key === "Enter") {
      const modo = opciones[indexSeleccionado];
      console.log(indexSeleccionado)
      if(indexSeleccionado== 0) hablar(narrativa.PROGRAMEMOSROBOBIT)
      if(indexSeleccionado  == 1) hablar(narrativa.MODOUBIT)
    
      seleccionarOpcion(modo.id);
      ejecutar()
    }

    // Teclas 1 y 2
    if (e.key === '1') {
      setIndexSeleccionado(0);
      hablar(`Modo ${opciones[0].nombre}. ${opciones[0].detalles}`);
    }
    if (e.key === '2') {
      setIndexSeleccionado(1);
      hablar(`Modo ${opciones[1].nombre}. ${opciones[1].detalles}`);
    }
  };

  const seleccionarOpcion = (id) => {
    const modo = opciones.find(o => o.id === id);
    hablar(`Seleccionado ${modo.nombre}. Iniciando...`);
    setTimeout(() => onSeleccionarModo(id), 1500);
  };

  return (
    <div className="pantalla-completa" onKeyDown={manejarTeclado} tabIndex="0">
      <BarraSuperior />

      <main className="area-principal">
        <header className="hero-card-recuadro">
          <h1>Selecciona el modo de trabajo</h1>
          <p>Usa <strong>TAB</strong> para elegir y <strong>ENTER</strong> para entrar.</p>
        </header>

        <section className="fila-tarjetas">
          {opciones.map((modo, idx) => (
            <div 
              key={modo.id}
              className={`project-card ${indexSeleccionado === idx ? 'focused-custom' : ''}`}
              onClick={() => {
                setIndexSeleccionado(idx);
                seleccionarOpcion(modo.id);
              }}
              role="button"
            >
              {/* Contenedor de imagen con tamaño fijo */}
              <div className="contenedor-imagen-fijo">
                <img src={modo.imagen} alt={modo.nombre} className="modo-img-preview" />
              </div>
              
              <div className="card-content">
                <div className="id-tag">Modo {idx + 1}</div>
                <h3>{modo.nombre}</h3>
                <p>{modo.detalles}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default SelectorModo;