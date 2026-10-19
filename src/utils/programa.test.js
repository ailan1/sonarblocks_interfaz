import {
  crearRepetir,
  esRepetir,
  vecesRepetir,
  nombreBase,
  hayRepetirAbierto,
  indicesDentroDeRepetir,
  expandirPrograma,
} from './programa';

const nombres = (pasos) => pasos.map((p) => p.bloque);

test('crea y reconoce el bloque Repetir', () => {
  const b = crearRepetir(4);
  expect(b).toBe('Repetir 4 veces');
  expect(esRepetir(b)).toBe(true);
  expect(vecesRepetir(b)).toBe(4);
  expect(nombreBase(b)).toBe('Repetir');
  expect(esRepetir('Avanzar')).toBe(false);
  expect(nombreBase('Avanzar')).toBe('Avanzar');
});

test('programa sin repeticiones: se ejecuta igual que antes', () => {
  const pasos = expandirPrograma(['Al empezar', 'Avanzar', 'Derecha', 'Esperar']);
  expect(nombres(pasos)).toEqual(['Avanzar', 'Derecha', 'Esperar']);
  expect(pasos.map((p) => p.indice)).toEqual([1, 2, 3]);
});

test('un cuadrado: repetir 4 veces avanzar y derecha', () => {
  const pasos = expandirPrograma([
    'Al empezar', 'Repetir 4 veces', 'Avanzar', 'Derecha', 'Fin de repetir',
  ]);
  expect(nombres(pasos)).toEqual([
    'Avanzar', 'Derecha', 'Avanzar', 'Derecha', 'Avanzar', 'Derecha', 'Avanzar', 'Derecha',
  ]);
  // cada paso apunta al bloque original, para marcarlo en pantalla
  expect(pasos.map((p) => p.indice)).toEqual([2, 3, 2, 3, 2, 3, 2, 3]);
  // la vuelta se anuncia solo en el primer bloque de cada vuelta
  expect(pasos.filter((p) => p.inicioVuelta).map((p) => p.vuelta)).toEqual([1, 2, 3, 4]);
});

test('los bloques después de Fin de repetir se ejecutan una sola vez', () => {
  const pasos = expandirPrograma([
    'Al empezar', 'Avanzar', 'Repetir 2 veces', 'Derecha', 'Fin de repetir', 'Corazón',
  ]);
  expect(nombres(pasos)).toEqual(['Avanzar', 'Derecha', 'Derecha', 'Corazón']);
});

test('si falta Fin de repetir, se repite hasta el final', () => {
  const bloques = ['Al empezar', 'Repetir 3 veces', 'Bip'];
  expect(hayRepetirAbierto(bloques)).toBe(true);
  expect(nombres(expandirPrograma(bloques))).toEqual(['Bip', 'Bip', 'Bip']);
});

test('una repetición vacía no ejecuta nada', () => {
  expect(expandirPrograma(['Al empezar', 'Repetir 3 veces', 'Fin de repetir'])).toEqual([]);
});

test('detecta qué bloques van corridos (dentro de la repetición)', () => {
  const bloques = ['Al empezar', 'Avanzar', 'Repetir 2 veces', 'Derecha', 'Bip', 'Fin de repetir', 'Esperar'];
  expect([...indicesDentroDeRepetir(bloques)]).toEqual([3, 4]);
  expect(hayRepetirAbierto(bloques)).toBe(false);
});
