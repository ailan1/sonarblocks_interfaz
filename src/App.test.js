import {
  bloquesData,
  obtenerBloque,
  obtenerTeclasRapidas,
  contraste,
  colorTextoPara,
} from './datos/bloquesData';

const bloquesBase = bloquesData.base.categorias.flatMap((c) => c.bloques);

test('cada bloque del modo básico tiene un color distinto', () => {
  const colores = bloquesBase.map((b) => b.color.toUpperCase());
  expect(new Set(colores).size).toBe(colores.length);
});

test('cada bloque del modo básico tiene un ícono distinto', () => {
  const iconos = bloquesBase.map((b) => b.icono);
  expect(iconos.every(Boolean)).toBe(true);
  expect(new Set(iconos).size).toBe(iconos.length);
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
