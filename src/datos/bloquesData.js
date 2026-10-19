import { nombreBase } from "../utils/programa";

// Colores del modo básico: paleta Okabe-Ito, distinguible con daltonismo.
// Cada bloque tiene un color e ícono propios, para no depender solo del color.
// "icono" es un nombre de componentes/Icono.jsx (librería Lucide).
// El color del texto (blanco o negro) lo elige Bloque.jsx según el contraste.
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
            color: "#009E73",
            icono: "inicio",
            tecla: "1",
            codigo: "start",
            descripcionAudio: "Bloque de inicio del programa",
          }
        ]
      },
      {
        nombre: "Movimiento",
        bloques: [
          {
            nombre: "Avanzar",
            color: "#0072B2",
            icono: "avanzar",
            tecla: "1",
            codigo: "move_forward",
            descripcionAudio: "Avanzar"
          },
          {
            nombre: "Izquierda",
            color: "#E69F00",
            icono: "izquierda",
            tecla: "2",
            codigo: "turn_left",
            descripcionAudio: "Girar a la izquierda"
          },
          {
            nombre: "Derecha",
            color: "#CC79A7",
            icono: "derecha",
            tecla: "3",
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
            color: "#F0E442",
            icono: "esperar",
            tecla: "1",
            codigo: "wait",
            descripcionAudio: "Esperar"
          },
          {
            nombre: "Bip",
            color: "#6D4C41",
            icono: "bip",
            tecla: "2",
            codigo: "play_tone",
            descripcionAudio: "El robot hace un sonido"
          }
        ]
      },
      // Repetir y Fin de repetir comparten color: son una pareja.
      // No tienen código: la app despliega la repetición (utils/programa.js).
      {
        nombre: "Repetir",
        bloques: [
          {
            nombre: "Repetir",
            color: "#56B4E9",
            icono: "repetir",
            tecla: "1",
            codigo: null,
            descripcionAudio: "Repite los bloques que siguen"
          },
          {
            nombre: "Fin de repetir",
            color: "#56B4E9",
            icono: "fin-repetir",
            tecla: "2",
            codigo: null,
            descripcionAudio: "Termina la repetición"
          }
        ]
      },
      // Comandos que el programa de la micro:bit ya entiende
      {
        nombre: "Luces",
        bloques: [
          {
            nombre: "Corazón",
            color: "#C62828",
            icono: "corazon",
            tecla: "1",
            codigo: "show_icon_heart",
            descripcionAudio: "Muestra un corazón en las luces del robot"
          },
          {
            nombre: "Cruz",
            color: "#8E3BB0",
            icono: "cruz",
            tecla: "2",
            codigo: "show_icon_cross",
            descripcionAudio: "Muestra una cruz en las luces del robot"
          },
          {
            nombre: "Apagar luces",
            color: "#3A3A3A",
            icono: "apagar-luces",
            tecla: "3",
            codigo: "clear_screen",
            descripcionAudio: "Apaga las luces del robot"
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
            color: "#00C853",
            tecla: "1",
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
            color: "#E3008C",
            tecla: "1",
            codigo: "show_icon_heart",
            descripcionAudio: "Muestra un corazón en la pantalla LED"
          },
          {
            nombre: "Mostrar ícono cruz",
            color: "#E3008C",
            tecla: "2",
            codigo: "show_icon_cross",
            descripcionAudio: "Muestra una cruz en la pantalla LED"
          },
          {
            nombre: "Borrar pantalla",
            color: "#AD1457",
            tecla: "3",
            codigo: "clear_screen",
            descripcionAudio: "Apaga todos los LEDs de la pantalla"
          },
          {
            nombre: "Mostrar HOLA",
            color: "#E3008C",
            tecla: "4",
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
            color: "#D83B01",
            tecla: "1",
            codigo: "play_tone",
            descripcionAudio: "Reproduce un tono musical"
          },
          {
            nombre: "Tocar melodía",
            color: "#D83B01",
            tecla: "2",
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
            color: "#107C10",
            tecla: "1",
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
            color: "#f28237ff",
            tecla: "1",
            codigo: "luz",
            descripcionAudio: "Valor del sensor de luz"
          },
          {
            nombre: "Sonido",
            color: "#e36200ff",
            tecla: "2",
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

// Acepta también "Repetir 4 veces" (devuelve los datos de "Repetir")
export const obtenerBloque = (modo, nombreBloque) => {
  const datosModo = bloquesData[modo];
  if (!datosModo) return null;
  const nombre = nombreBase(nombreBloque);
  for (const categoria of datosModo.categorias) {
    const bloque = categoria.bloques.find(b => b.nombre === nombre);
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

// Luminancia relativa según WCAG 2.1
const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contraste = (hexA, hexB) => {
  const [claro, oscuro] = [luminancia(hexA), luminancia(hexB)].sort((a, b) => b - a);
  return (claro + 0.05) / (oscuro + 0.05);
};

// Texto blanco o negro: el que más contraste tenga con el color del bloque
export const colorTextoPara = (hexFondo) =>
  contraste(hexFondo, "#FFFFFF") >= contraste(hexFondo, "#000000") ? "#FFFFFF" : "#000000";