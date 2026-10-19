// ── Repetir ─────────────────────────────────────────────────────────────────
// El programa sigue siendo una lista simple de textos. La repetición se marca
// con dos bloques: "Repetir N veces" y "Fin de repetir". Lo que queda entre
// ellos se repite. No hay repeticiones dentro de repeticiones: así es más fácil
// de entender y de escuchar.

export const REPETIR     = 'Repetir';
export const FIN_REPETIR = 'Fin de repetir';
export const MIN_VECES   = 2;
export const MAX_VECES   = 9;

const PATRON_REPETIR = /^Repetir (\d) veces$/;

export const crearRepetir = (veces) => `Repetir ${veces} veces`;

export const esRepetir = (bloque) => PATRON_REPETIR.test(bloque);

export const vecesRepetir = (bloque) => Number(bloque.match(PATRON_REPETIR)?.[1] ?? 0);

// Nombre del bloque en bloquesData ("Repetir 4 veces" → "Repetir")
export const nombreBase = (bloque) => (esRepetir(bloque) ? REPETIR : bloque);

// ¿Hay un "Repetir" sin su "Fin de repetir"?
export const hayRepetirAbierto = (bloques) => {
  let abierto = false;
  for (const b of bloques) {
    if (esRepetir(b)) abierto = true;
    else if (b === FIN_REPETIR) abierto = false;
  }
  return abierto;
};

// Posiciones de los bloques que están dentro de una repetición (para sangrarlos)
export const indicesDentroDeRepetir = (bloques) => {
  const dentro = new Set();
  let abierto = false;
  bloques.forEach((b, i) => {
    if (esRepetir(b)) { abierto = true; return; }
    if (b === FIN_REPETIR) { abierto = false; return; }
    if (abierto) dentro.add(i);
  });
  return dentro;
};

/**
 * Despliega el programa en la lista de pasos que se ejecutan, uno por uno.
 * Cada paso recuerda de qué bloque viene (indice) y, si está en una
 * repetición, en qué vuelta va. Si falta "Fin de repetir", se repite hasta
 * el final del programa.
 *
 *   ['Al empezar', 'Repetir 2 veces', 'Avanzar', 'Fin de repetir', 'Esperar']
 *   → Avanzar (vuelta 1 de 2), Avanzar (vuelta 2 de 2), Esperar
 */
export const expandirPrograma = (bloques) => {
  const pasos = [];
  let i = 1; // el 0 es "Al empezar"

  while (i < bloques.length) {
    const bloque = bloques[i];

    if (esRepetir(bloque)) {
      const veces = vecesRepetir(bloque);
      let fin = i + 1;
      while (fin < bloques.length && bloques[fin] !== FIN_REPETIR) fin++;

      const cuerpo = [];
      for (let j = i + 1; j < fin; j++) cuerpo.push({ bloque: bloques[j], indice: j });

      for (let vuelta = 1; vuelta <= veces; vuelta++) {
        cuerpo.forEach((paso, k) => {
          pasos.push({ ...paso, vuelta, veces, inicioVuelta: k === 0 });
        });
      }
      i = fin + 1; // saltea el "Fin de repetir"
      continue;
    }

    if (bloque !== FIN_REPETIR) pasos.push({ bloque, indice: i });
    i++;
  }
  return pasos;
};
