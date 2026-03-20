import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BarraSuperior from '../BarraSuperior';
import { Plus, Cloud, FileCode } from 'lucide-react';

const Dashboard = () => {
  // Estados originales
  const [ejecutando, setEjecutando] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState("Desconectado");

  // 1. Lista dinámica de proyectos
  const [proyectos] = useState([
    { id: "101", nombre: "Semáforo Inteligente" },
    { id: "102", nombre: "Sensor de Distancia" },
    { id: "103", nombre: "Robot Seguidor" }
  ]);

  // 2. Estado para controlar la navegación personalizada
  const [indexSeleccionado, setIndexSeleccionado] = useState(0);

  // Definimos los elementos navegables: El botón "Nuevo", los proyectos y la "Nube"
  const elementosNavegables = [
    { id: 'nuevo', nombre: 'Nuevo proyecto', tipo: 'accion', icon: <Plus size={48} /> },
    ...proyectos.map(p => ({ ...p, tipo: 'proyecto', icon: <FileCode size={40} /> })),
  ];

  const hablar = (texto) => {
    const utterance = new SpeechSynthesisUtterance(texto);
    window.speechSynthesis.cancel(); 
    window.speechSynthesis.speak(utterance);
  };

  const manejarConexion = () => {
    setEstadoConexion(prev => prev === "Conectado" ? "Desconectado" : "Conectado");
  };

  // 3. Tu lógica de TAB integrada
  const manejarTeclado = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Bloquea el comportamiento por defecto
      
      const total = elementosNavegables.length;
      
      // Lógica de avance/retroceso (Shift+Tab)
      const siguiente = e.shiftKey 
        ? (indexSeleccionado - 1 + total) % total 
        : (indexSeleccionado + 1) % total;
        
      setIndexSeleccionado(siguiente);

      // Feedback de voz para cada elemento
      const item = elementosNavegables[siguiente];
      if (item.tipo === 'proyecto') {
        hablar(`Proyecto: ${item.nombre}. Identificador ${item.id}`);
      } else {
        hablar(item.nombre);
      }
    }

    if (e.key === "Enter") {
      const item = elementosNavegables[indexSeleccionado];
      console.log("Ejecutando acción sobre:", item.nombre);
    }
  };

  return (
    <div className="dashboard-accesible" onKeyDown={manejarTeclado} tabIndex="-1">
      
      <BarraSuperior 
        tipoProgramacion="bloques"
        onConectar={manejarConexion}
        estadoConexion={estadoConexion}
        ejecutando={ejecutando}
        modoNavegacion="teclado"
      />

      <main className="content-wrapper">
        <section className="hero-card" aria-labelledby="hero-title">
          <h1 id="hero-title">Bienvenido a SonarBlocks</h1>
          <p>Utiliza TAB para moverte entre tus proyectos guardados.</p>
          <button className="start-btn">Comenzar tutorial guiado</button>
        </section>

        <section className="projects-section">
          <h2 id="projects-title">Mis proyectos</h2>

          <div className="projects-grid">
            {elementosNavegables.map((item, idx) => (
              <div 
                key={item.id}
                className={`project-card ${indexSeleccionado === idx ? 'focused-custom' : ''}`}
                role="button"
                aria-current={indexSeleccionado === idx ? "true" : "false"}
              >
                <div className="card-icon-wrapper">
                  {item.icon}
                </div>
                <div className="card-content">
                  <h3>{item.nombre}</h3>
                  <p>{item.tipo === 'proyecto' ? `ID: ${item.id}` : 'Acción del sistema'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;