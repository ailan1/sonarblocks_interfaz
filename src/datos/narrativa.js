export const narrativa = {
  BIENVENIDA: "¡Hola! Bienvenido a Sonar Blocks. Vamos a crear algo increíble. Pulsa la tecla TAB para descubrir los grupos de bloques y las letras para añadirlos a tu programa.",
  
  CATEGORIAS: "Estás en el grupo de bloques. Pulsa TAB para saltar al siguiente grupo. ¡Escucha bien las teclas para elegir tu favorito!",
  
  AREA_VACIA: "Tu pizarra de música está limpia. ¡Es el momento de empezar a crear!",
  
  CONEXION: (estado) => estado === "conectado" 
    ? "¡Genial! Tu Microbit ya está listo para jugar." 
    : "Tu Microbit se ha ido a descansar. Intenta conectarlo de nuevo.",
    
  BLOQUE_ANADIDO: (nombre, total) => {
    if (total === 1) return `¡Primer bloque listo! Has puesto: ${nombre}.`;
    return `¡Muy bien! Añadiste ${nombre}. Ya tienes ${total} bloques en tu fila.`;
  },
  
  BORRAR_ULTIMO: (nombre, quedan) => {
    if (quedan === 0) return `Quitamos ${nombre}. ¡La pizarra ha quedado vacía!`;
    return `Listo, borramos ${nombre}. Ahora te quedan ${quedan} bloques.`;
  },
  
  LEER_BLOQUE: (nombre, pos, total) => `En el lugar número ${pos}, tienes el bloque: ${nombre}.`,
  
  INICIO_PROGRAMA: "¡Atención! Tres, dos, uno... ¡Tu programa empieza a funcionar!",
  
  FIN_PROGRAMA: "¡Bravo! Tu programa ha terminado. ¿Qué quieres inventar ahora?"
};