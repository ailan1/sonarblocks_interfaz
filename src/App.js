import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BarraSuperior from './componentes/BarraSuperior';
import SelectorModo from './componentes/SelectorModo';
import CategoriasBloques from './componentes/CategoriasBloques';
import AreaTrabajo from './componentes/AreaTrabajo';
import PantallaBienvenida from "./componentes/interfaz/PantallaBienvenida"
import ControlesPrograma from './componentes/ControlesPrograma';
import { useAudio } from './hooks/useAudio';
import { useMicrobit } from './hooks/useMicrobit';
import TtsTester from "./test/test"
import { 
  obtenerBloquesPorModo,
  obtenerTeclasRapidas,
  obtenerBloque 
} from './datos/bloquesData';
import './estilos/App.css';
import { speakWithGoogle } from './hooks/googleTTS'; 

function App() {
  const [tipoProgramacion, setTipoProgramacion] = useState('');
  const [bloques, setBloques] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [modoNavegacion, setModoNavegacion] = useState('teclas-rapidas');
  const { hablar, hablarYEsperar, narrativa } = useAudio();
  const { conectarMicrobit, enviarComando, estaConectado ,estadoConexion } = useMicrobit();
  const datosModoActual = obtenerBloquesPorModo(tipoProgramacion);
  const teclasRapidasActuales = obtenerTeclasRapidas(tipoProgramacion);

  const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const agregarBloque = (nombreBloque) => {
    if (nombreBloque === "Al empezar" && bloques.includes("Al empezar")) {
      hablar(narrativa.YATIENESINICIO);
      return;
    }
    localStorage.setItem("primeraVez", true)
    const bloqueData = obtenerBloque(tipoProgramacion, nombreBloque);
    let bloqueFinal = nombreBloque;
    
    if (bloqueData && bloqueData.conInput) {
      const texto = prompt("Escribe el mensaje que quieres que el personaje diga:");
      if (texto) {
        bloqueFinal = `Decir: ${texto}`;
      } else {
        return;
      }
    }
    
    setBloques((prev) => 
      nombreBloque === "Al empezar" ? ["Al empezar", ...prev] : [...prev, bloqueFinal]
    );
    
    const mensajeAudio = bloqueData ? bloqueData.descripcionAudio : nombreBloque;
    console.log(nombreBloque)
    if(nombreBloque =="Al empezar")hablar(narrativa.BLOQUEINICIO)
    if(nombreBloque =="Avanzar")hablar(narrativa.AVANZAR)
    if(nombreBloque =="Izquierda")hablar(narrativa.IZQUIERDA)
    if(nombreBloque =="Derecha")hablar(narrativa.DERECHA)
    if(nombreBloque =="Esperar")hablar(narrativa.ESPERAR)
    //hablar(narrativa.BLOQUE_ANADIDO(mensajeAudio, bloques.length));
  };

  const eliminarUltimoBloque = async () => {
    if (bloques.length > 0) {
      const borrado = bloques[bloques.length - 1];
      setBloques((prev) => prev.slice(0, -1));
      hablar(narrativa.ELIMINARULTIMOBLOQUE)
      //hablar(`Bloque ${borrado} eliminado`);
      await new Promise(r => setTimeout(r, 2000));
      
    } else {
      hablar("No hay bloques para borrar");
    }
  };
  const inicio = () => {
    console.log("entre")
    hablar(narrativa.INTROROBOBIT)}

  const ejecutarPrograma = async () => {
    if (ejecutando) {
      hablar("El programa ya se está ejecutando");
      return;
    }

    if (!bloques[0] || bloques[0] !== "Al empezar") {
      hablar(narrativa.BLOQUEINICIOPARACOMENZAR);
      return;
    }
    
    if (bloques.length === 1) {
      hablar("Tu programa está vacío. Agrega más bloques");
      return;
    }

    setEjecutando(true);
    
    try {
      console.log(estadoConexion)
      if(estaConectado){
     // await hablarYEsperar("Iniciando programa");
      
      for (let i = 1; i < bloques.length; i++) {
        const bloque = bloques[i];
        
        if (bloque.startsWith("Decir:")) {
          const mensaje = bloque.replace("Decir:", "").trim();
          
        } else {
          const bloqueData = obtenerBloque(tipoProgramacion, bloque);
          const comando = bloqueData ? bloqueData.codigo : bloque;
          const descripcion = bloqueData ? bloqueData.descripcionAudio : bloque;
          

          if(bloqueData.nombre =="Avanzar")hablarYEsperar(narrativa.AVANZANDO)
          if(bloqueData.nombre =="Izquierda")hablarYEsperar(narrativa.GIRARIZQUIERDA)
          if(bloqueData.nombre =="Derecha")hablarYEsperar(narrativa.GIRARDERECHA)
          if(bloqueData.nombre =="Esperar")hablarYEsperar(narrativa.ESPERAR)
          //await hablarYEsperar(`Ejecutando ${descripcion}`);
            
          if (enviarComando) {
            enviarComando(comando);
          }
       await esperar(2000); 
        }
        
        
      }
      
      hablar(narrativa.FINPROGRAMACION)
      }else{
        hablar(narrativa.DESCONECTADO)
      }
    } catch (error) {
      console.error('Error ejecutando programa:', error);
      await hablarYEsperar("Ha ocurrido un error");
    } finally {
      setEjecutando(false);
    }
  };

  const leerPrograma = async () => {
    if (bloques.length === 0) {
      hablar("El programa está vacío");
      
    } else {
        hablarYEsperar(narrativa.REVISARCODIGO)
                 await esperar(2000); 
          
        for (let i = 1; i < bloques.length; i++) {
        const bloque = bloques[i];
        
        if (bloque.startsWith("Decir:")) {
          const mensaje = bloque.replace("Decir:", "").trim();
          
        } else {
          const bloqueData = obtenerBloque(tipoProgramacion, bloque);
          
          if(bloqueData.nombre =="Avanzar")hablarYEsperar(narrativa.LEERAVANZAR)
          if(bloqueData.nombre =="Izquierda")hablarYEsperar(narrativa.LEERIZQUIERDA)
          if(bloqueData.nombre =="Derecha")hablarYEsperar(narrativa.LEERDERECHA)
          if(bloqueData.nombre =="Esperar")hablarYEsperar(narrativa.LEERESPERAR)
         
            await esperar(2000); 
          
    
        }
        
        
      }

    }
  };

  


function App() {
  const { hablar, narrativa, desbloquearAudio, pararAudio } = useAudio();
  

}
  useEffect(() => {
   
    const manejarTecla = (e) => {
      if (ejecutando) return;
      
      const tecla = e.key.toLowerCase();
  
      // --- NAVEGACIÓN POR TAB ---
      if (e.key === "Tab" && tipoProgramacion !='') {
        e.preventDefault(); // Bloquea el comportamiento por defecto del navegador
        setModoNavegacion('navegacion-paleta');
        //  hablar(narrativa.CATEGORIAS)
        setCategoriaSeleccionada((prev) => {
          const totalCategorias = datosModoActual.categorias.length;
          // Si presionas Shift + Tab retrocede, si es solo Tab avanza
          const siguiente = e.shiftKey 
            ? (prev - 1 + totalCategorias) % totalCategorias 
            : (prev + 1) % totalCategorias;
            
          const cat = datosModoActual.categorias[siguiente];
          const bloquesInfo = cat.bloques.map(b => 
            `${b.tecla ? b.tecla.toUpperCase() : '?'} para ${b.nombre}`
          ).join(', ');
          console.log(cat.nombre)
          if(cat.nombre== "Movimiento"){
            hablar(narrativa.MOVIMIENTO)
          }
            if(cat.nombre== "Inicio"){
            hablar(narrativa.INICIO)
          }
          if(cat.nombre== "Acciones"){
            hablar(narrativa.ACCIONES)
          }

        




          

          //hablar(`Categoría ${cat.nombre}. Bloques: ${bloquesInfo}`);
          return siguiente;
        });
        return;
      }
     

      // --- TECLAS DE ACCIÓN ---
      if (tecla === "backspace") {
        eliminarUltimoBloque();
        return;
      }
       if (e.key === "h"){ hablar(narrativa.CATEGORIAS)}
      if (tecla === " ") {
        ejecutarPrograma();
        return;
      }
      if (tecla === "l") {
        leerPrograma();
        return;
      }

      // --- AGREGAR BLOQUES (Teclas asignadas) ---
      // Primero buscamos en la categoría actual para dar prioridad
      const catActual = datosModoActual.categorias[categoriaSeleccionada];
      const bloqueEncontrado = catActual.bloques.find(b => b.tecla?.toLowerCase() === tecla);
      
      if (bloqueEncontrado) {
        agregarBloque(bloqueEncontrado.nombre);
        return;
      }

      // Si no, buscamos en el mapa global de teclas rápidas
      if (teclasRapidasActuales[tecla]) {
        agregarBloque(teclasRapidasActuales[tecla]);
        return;
      }
    };
    
  
    
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [ejecutando, modoNavegacion, datosModoActual, teclasRapidasActuales, bloques, categoriaSeleccionada]);




  if (!tipoProgramacion) {
   
    return <SelectorModo onSeleccionarModo={setTipoProgramacion} ejecutar={inicio} />;
  }
  

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <BarraSuperior 
          tipoProgramacion={datosModoActual.nombre}
          onConectar={conectarMicrobit}
          estadoConexion={estadoConexion}
          ejecutando={ejecutando}
          modoNavegacion={modoNavegacion}
        />
        
        <div className="contenido-principal">
          <CategoriasBloques 
            onAgregarBloque={agregarBloque}
            categoriasBloques={datosModoActual.categorias}
            teclasRapidas={teclasRapidasActuales}
            deshabilitado={ejecutando}
            categoriaSeleccionada={categoriaSeleccionada}
            modoNavegacion={modoNavegacion}
          />
          
          <div className="area-programacion">
            <AreaTrabajo 
              bloques={bloques}
              onAgregarBloque={agregarBloque}
              modo={tipoProgramacion}
              ejecutando={ejecutando}
            />
            
            <ControlesPrograma 
              bloques={bloques}
              onEjecutar={ejecutarPrograma}
              onEliminarUltimo={eliminarUltimoBloque}
              onLeerPrograma={leerPrograma}
              ejecutando={ejecutando}
            />
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;