import {
  bloquesData,
  obtenerBloque,
  obtenerTeclasRapidas,
  contraste,
  colorTextoPara,
} from './datos/bloquesData';
import { existeIcono } from './componentes/Icono';

const bloquesBase = bloquesData.base.categorias.flatMap((c) => c.bloques);

test('cada bloque del modo básico tiene un color distinto', () => {
  // "Fin de repetir" comparte color con "Repetir" a propósito: son una pareja
  const colores = bloquesBase
    .filter((b) => b.nombre !== 'Fin de repetir')
    .map((b) => b.color.toUpperCase());
  expect(new Set(colores).size).toBe(colores.length);
});

// Comandos que entiende el programa de la micro:bit (onUartDataReceived)
const COMANDOS_MICROBIT = [
  'start', 'move_forward', 'turn_left', 'turn_right', 'wait',
  'show_icon_heart', 'show_icon_cross', 'clear_screen', 'show_text',
  'play_tone', 'play_melody', 'luz', 'SeguirLinea',
];

test('cada bloque manda un comando que la micro:bit entiende', () => {
  bloquesBase
    .filter((b) => b.codigo !== null) // Repetir y Fin los resuelve la app
    .forEach((b) => expect(COMANDOS_MICROBIT).toContain(b.codigo));
});

test('cada bloque del modo básico tiene un ícono distinto', () => {
  const iconos = bloquesBase.map((b) => b.icono);
  expect(iconos.every(Boolean)).toBe(true);
  expect(new Set(iconos).size).toBe(iconos.length);
});

test('los íconos de los bloques existen en la librería (Icono.jsx)', () => {
  bloquesBase.forEach((b) => expect(existeIcono(b.icono)).toBe(true));
});

test('el texto de cada bloque cumple contraste WCAG AA (4.5:1)', () => {
  bloquesBase.forEach((b) => {
    expect(contraste(b.color, colorTextoPara(b.color))).toBeGreaterThanOrEqual(4.5);
  });
});

test('encuentra los bloques del modo básico', () => {
  expect(obtenerBloque('base', 'Avanzar').codigo).toBe('move_forward');
  expect(obtenerBloque('base', 'No existe')).toBeNull();
});

test('las teclas rápidas apuntan a bloques existentes', () => {
  Object.values(obtenerTeclasRapidas('base')).forEach((nombre) => {
    expect(obtenerBloque('base', nombre)).not.toBeNull();
  });
});
