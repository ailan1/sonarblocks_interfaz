export const bloquesData = {
  base: {
    nombre: "Básico",
    descripcion: "Bloques para mover tu MicroBit",
    categorias: [
      {
        nombre: "Inicio",
        bloques: [
          {
            nombre: "Al empezar",
            color: "#00C853", // verde de inicio (igual al oficial)
            tecla: "V",
            codigo: "start",
            descripcionAudio: "Bloque de inicio del programa",
            repetir:""

          }
        ]
      },
      {
        nombre: "Movimiento",
        bloques: [
          {
            nombre: "Avanzar",
            color: "#4B4BF9", // azul MakeCode básico
            tecla: "a",
            codigo: "move_forward",
            descripcionAudio: "Avanzar"
          },
          {
            nombre: "Izquierda",
            color: "#9966FF", // morado movimiento personalizado
            tecla: "i",
            codigo: "turn_left",
            descripcionAudio: "Girar a la izquierda"
          },
          {
            nombre: "Derecha",
            color: "#9966FF", // igual que izquierda
            tecla: "d",
            codigo: "turn_right",
            descripcionAudio: "Girar a la derecha"
          },
           
        ]
      },
      {
        nombre: "Acciones",
        bloques: [
          {
            nombre: "Esperar",
            color: "#F2C037", // amarillo MakeCode (pausa, básico)
            tecla: "e",
            codigo: "wait",
            descripcionAudio: "Esperar"
          }
        ]
      },
    ]
  },

  auto: {
    nombre: "Auto",
    descripcion: "Bloques esenciales de MakeCode para Micro:bit",
    categorias: [
      {
        nombre: "Inicio",
        bloques: [
          {
            nombre: "Al empezar",
            color: "#00C853", // verde de inicio
            tecla: "v",
            codigo: "start",
            descripcionAudio: "Bloque que inicia el programa"
          }
        ]
      },
      {
        nombre: "LED",
        bloques: [
          {
            nombre: "Mostrar ícono corazón",
            color: "#E3008C", // rosa LED
            tecla: "c",
            codigo: "show_icon_heart",
            descripcionAudio: "Muestra un corazón en la pantalla LED"
          },
          {
            nombre: "Mostrar ícono cruz",
            color: "#E3008C",
            tecla: "r",
            codigo: "show_icon_cross",
            descripcionAudio: "Muestra una cruz en la pantalla LED"
          },
          {
            nombre: "Borrar pantalla",
            color: "#AD1457", // más oscuro para “clear”
            tecla: "b",
            codigo: "clear_screen",
            descripcionAudio: "Apaga todos los LEDs de la pantalla"
          },
          {
            nombre: "Mostrar HOLA",
            color: "#E3008C",
            tecla: "H",
            codigo: "show_text",
            descripcionAudio: "Muestra un texto en la pantalla LED"
          }
        ]
      },
      {
        nombre: "Música",
        bloques: [
          {
            nombre: "Tocar tono",
            color: "#D83B01", // naranja MakeCode música
            tecla: "t",
            codigo: "play_tone",
            descripcionAudio: "Reproduce un tono musical"
          },
          {
            nombre: "Tocar melodía",
            color: "#D83B01",
            tecla: "m",
            codigo: "play_melody",
            descripcionAudio: "Reproduce una melodía"
          }
        ]
      },
      {
        nombre: "Lógica",
        bloques: [
          {
            nombre: "Si... entonces",
            color: "#107C10", // verde MakeCode lógica
            tecla: "s",
            codigo: "if_then",
            descripcionAudio: "Ejecuta un bloque si se cumple una condición"
          }
        ]
      },
       {
        nombre: "Sensor",
        bloques: [
          {
            nombre: "Luz",
            color: "#f28237ff", // amarillo MakeCode (pausa, básico)
            tecla: "o",
            codigo: "luz",
            descripcionAudio: "Valor del sensor de luz"
          },
          {
            nombre: "Sonido",
            color: "#e36200ff", // rosa (LED / mostrar texto)
            tecla: "q",
            codigo: "Sonido",
            descripcionAudio: "Valor del sensor de audio",
      
          }
        ]
      }
    ]
  }
};


export const obtenerBloquesPorModo = (modo) => {
  return bloquesData[modo] || bloquesData.base;
};


export const obtenerBloque = (modo, nombreBloque) => {
  const datosModo = bloquesData[modo];
  if (!datosModo) return null;
  
  for (const categoria of datosModo.categorias) {
    const bloque = categoria.bloques.find(b => b.nombre === nombreBloque);
    if (bloque) return bloque;
  }
  return null;
};

export const obtenerTeclasRapidas = (modo) => {
  const datosModo = bloquesData[modo];
  if (!datosModo) return {};
  
  const teclas = {};
  datosModo.categorias.forEach(categoria => {
    categoria.bloques.forEach(bloque => {
      if (bloque.tecla) {
        teclas[bloque.tecla] = bloque.nombre;
      }
    });
  });
  
  return teclas;
};


export const obtenerCodigoBloque = (modo, nombreBloque) => {
  const bloque = obtenerBloque(modo, nombreBloque);
  return bloque ? bloque.codigo : null;
};


export const obtenerColorBloque = (modo, nombreBloque) => {
  const bloque = obtenerBloque(modo, nombreBloque);
  return bloque ? bloque.color : "#66ccff";
};