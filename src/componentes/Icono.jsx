import React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRightToLine,
  ArrowUp,
  Bell,
  Bluetooth,
  BluetoothConnected,
  Bot,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleX,
  Contrast,
  CornerDownLeft,
  CornerUpLeft,
  CornerUpRight,
  Delete,
  Flag,
  Hand,
  Heart,
  Hourglass,
  LightbulbOff,
  LoaderCircle,
  Megaphone,
  OctagonX,
  Play,
  Pointer,
  Puzzle,
  Repeat,
  Square,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';

/**
 * Todos los íconos de la app salen de acá (librería Lucide), así tienen
 * el mismo estilo. Toman el color del texto (currentColor), por eso
 * funcionan en cualquier bloque y en alto contraste.
 *
 * Uso: <Icono nombre="avanzar" />
 */
const ICONOS = {
  // Bloques
  'inicio':        Flag,
  'avanzar':       ArrowUp,
  'izquierda':     CornerUpLeft,
  'derecha':       CornerUpRight,
  'esperar':       Hourglass,
  'bip':           Bell,
  'repetir':       Repeat,
  'fin-repetir':   OctagonX,
  'corazon':       Heart,
  'cruz':          X,
  'apagar-luces':  LightbulbOff,

  // Botones
  'velocidad':     Volume2,
  'contraste':     Contrast,
  'bluetooth':     Bluetooth,
  'conectado':     BluetoothConnected,
  'ejecutar':      Play,
  'ejecutando':    LoaderCircle,
  'borrar':        Delete,
  'leer':          Megaphone,
  'parar':         Square,

  // Navegación y estados
  'cerrada':       ChevronRight,
  'abierta':       ChevronDown,
  'actual':        ArrowLeft,
  'senalar':       Pointer,
  'bien':          CircleCheck,
  'mal':           CircleX,

  // Tutorial
  'hola':          Hand,
  'tab':           ArrowRightToLine,
  'enter':         CornerDownLeft,
  'bloques':       Puzzle,
  'flecha-abajo':  ArrowDown,
  'flecha-arriba': ArrowUp,
  'robot':         Bot,
  'trofeo':        Trophy,
};

export const existeIcono = (nombre) => Boolean(ICONOS[nombre]);

// Trazo grueso (2.5) para que se vean bien con baja visión.
// aria-hidden: el texto al lado ya dice qué es; el ícono es solo visual.
const Icono = ({ nombre, size = 22, strokeWidth = 2.5, className = '', ...props }) => {
  const Componente = ICONOS[nombre];
  if (!Componente) return null;
  return (
    <Componente
      size={size}
      strokeWidth={strokeWidth}
      className={`icono ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
};

export default Icono;
