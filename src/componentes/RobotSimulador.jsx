import React, { useMemo } from 'react';
import { expandirPrograma } from '../utils/programa';
import Icono from './Icono';

const TAMANO_ARENA = 300;
const PASO_MOVIMIENTO = 60;
const CENTRO = TAMANO_ARENA / 2;

const ROTACION = { norte: -90, sur: 90, este: 0, oeste: 180 };
const DELTA = {
  norte: { x: 0, y: -PASO_MOVIMIENTO },
  sur: { x: 0, y: PASO_MOVIMIENTO },
  este: { x: PASO_MOVIMIENTO, y: 0 },
  oeste: { x: -PASO_MOVIMIENTO, y: 0 },
};
const GIRO_IZQ = { norte: 'oeste', oeste: 'sur', sur: 'este', este: 'norte' };
const GIRO_DER = { norte: 'este', este: 'sur', sur: 'oeste', oeste: 'norte' };
// Texto e ícono que se muestran debajo del simulador mientras se ejecuta cada bloque
const LABELS = {
  Avanzar:        { icono: 'avanzar',      texto: 'Avanzando...' },
  Izquierda:      { icono: 'izquierda',    texto: 'Girando izquierda...' },
  Derecha:        { icono: 'derecha',      texto: 'Girando derecha...' },
  Esperar:        { icono: 'esperar',      texto: 'Esperando...' },
  Bip:            { icono: 'bip',          texto: '¡Bip!' },
  'Corazón':      { icono: 'corazon',      texto: 'Mostrando corazón' },
  Cruz:           { icono: 'cruz',         texto: 'Mostrando cruz' },
  'Apagar luces': { icono: 'apagar-luces', texto: 'Apagando luces' },
};

// Dibujos de la pantalla de luces 5×5 (los mismos íconos que usa la micro:bit)
const DIBUJOS_LUCES = {
  'Corazón': [
    '.#.#.',
    '#####',
    '#####',
    '.###.',
    '..#..',
  ],
  Cruz: [
    '#...#',
    '.#.#.',
    '..#..',
    '.#.#.',
    '#...#',
  ],
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Recorre los pasos del programa (con las repeticiones ya desplegadas) hasta
// el que se está ejecutando, y devuelve dónde está el robot, hacia dónde mira,
// el rastro que dejó y qué muestran sus luces.
// El robot arranca en el centro mirando al este, con las luces apagadas.
const calcularEstado = (pasos, pasoActual) => {
  let pos = { x: CENTRO, y: CENTRO };
  let dir = 'este';
  let luces = null;
  const rastro = [];

  if (pasoActual === null) return { pos, dir, rastro, luces };

  for (let i = 0; i <= pasoActual && i < pasos.length; i++) {
    const bloque = pasos[i].bloque;
    if (DIBUJOS_LUCES[bloque])     { luces = bloque; continue; }
    if (bloque === 'Apagar luces') { luces = null;   continue; }
    switch (bloque) {
      case 'Avanzar': {
        const nueva = {
          x: clamp(pos.x + DELTA[dir].x, 20, TAMANO_ARENA - 20),
          y: clamp(pos.y + DELTA[dir].y, 20, TAMANO_ARENA - 20),
        };
        rastro.push({ x1: pos.x, y1: pos.y, x2: nueva.x, y2: nueva.y });
        pos = nueva;
        break;
      }
      case 'Izquierda':
        dir = GIRO_IZQ[dir];
        break;
      case 'Derecha':
        dir = GIRO_DER[dir];
        break;
      default:
        break;
    }
  }
  return { pos, dir, rastro, luces };
};

// Pantalla de luces 5×5, como la de la micro:bit
const PantallaLuces = ({ dibujo }) => {
  const filas = DIBUJOS_LUCES[dibujo] || Array(5).fill('.....');
  return (
    <div className="pantalla-luces" role="img" aria-label={dibujo ? `Luces: ${dibujo}` : 'Luces apagadas'}>
      {filas.flatMap((fila, y) => [...fila].map((c, x) => (
        <span key={`${x}-${y}`} className={`luz ${c === '#' ? 'luz-prendida' : ''}`} />
      )))}
    </div>
  );
};

const RobotSVG = ({ esperando }) => (
  <g>
    {/* Sombra */}
    <ellipse cx="0" cy="28" rx="22" ry="6" fill="rgba(0,0,0,0.13)" />

    {/* Cuerpo */}
    <rect x="-20" y="-22" width="40" height="38" rx="8" fill="#4C97FF" />

    {/* Frente (indicador de dirección) */}
    <rect x="-14" y="-18" width="28" height="16" rx="4" fill="#2563c7" />

    {/* Ojos */}
    <circle cx="-7" cy="-12" r="5" fill="white" />
    <circle cx="7" cy="-12" r="5" fill="white" />
    <circle cx="-7" cy="-12" r="2.5" fill={esperando ? '#f59e0b' : '#1d4ed8'} />
    <circle cx="7" cy="-12" r="2.5" fill={esperando ? '#f59e0b' : '#1d4ed8'} />

    {/* Boca */}
    <path
      d={esperando ? 'M -6 -1 Q 0 -4 6 -1' : 'M -6 -1 Q 0 3 6 -1'}
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Ruedas */}
    <rect x="-24" y="2" width="8" height="12" rx="4" fill="#1e40af" />
    <rect x="16" y="2" width="8" height="12" rx="4" fill="#1e40af" />

    {/* Antena */}
    <line x1="0" y1="-22" x2="0" y2="-32" stroke="#93c5fd" strokeWidth="2" />
    <circle cx="0" cy="-34" r="3" fill="#93c5fd" />
  </g>
);

const EstadoActual = ({ ejecutando, paso }) => {
  if (!ejecutando) return '— En espera —';
  const label = paso && LABELS[paso.bloque];
  if (!label) return '';
  const vuelta = paso.vuelta ? ` (vuelta ${paso.vuelta} de ${paso.veces})` : '';
  return <><Icono nombre={label.icono} size={18} /> {label.texto}{vuelta}</>;
};

// El simulador no tiene reloj propio: sigue a `pasoActual`, que lo marca
// useBloques al mismo tiempo que le envía el comando al robot físico.
const RobotSimulador = ({ bloques, ejecutando, pasoActual }) => {
  const pasos = useMemo(() => expandirPrograma(bloques), [bloques]);
  const { pos, dir, rastro, luces } = useMemo(
    () => calcularEstado(pasos, ejecutando ? pasoActual : null),
    [pasos, ejecutando, pasoActual]
  );
  const paso = ejecutando && pasoActual !== null ? pasos[pasoActual] : null;
  const esperando = paso?.bloque === 'Esperar';

  const rotacion = ROTACION[dir];

  const puntosSuelo = useMemo(() => {
    const pts = [];
    for (let col = 1; col <= 4; col++) {
      for (let row = 1; row <= 4; row++) {
        pts.push({
          cx: col * (TAMANO_ARENA / 5),
          cy: row * (TAMANO_ARENA / 5),
          key: `${col}-${row}`,
        });
      }
    }
    return pts;
  }, []);

  return (
    <div className="simulador">
      <span className="simulador-titulo">Vista del robot</span>

      <svg
        className="simulador-arena"
        viewBox={`0 0 ${TAMANO_ARENA} ${TAMANO_ARENA}`}
        role="img"
        aria-label="Simulador del robot"
      >
        {/* Suelo con puntos */}
        {puntosSuelo.map((p) => (
          <circle key={p.key} cx={p.cx} cy={p.cy} r={2.5} style={{ fill: 'var(--puntos-arena)' }} />
        ))}

        {/* Punto de inicio */}
        <circle
          cx={CENTRO}
          cy={CENTRO}
          r={6}
          fill="none"
          style={{ stroke: 'var(--rastro)' }}
          strokeWidth={2}
          strokeDasharray="3 2"
        />

        {/* Rastro */}
        {rastro.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            style={{ stroke: 'var(--rastro)' }}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}

        {/* Robot */}
        <g
          transform={`translate(${pos.x}, ${pos.y}) rotate(${rotacion})`}
          style={{ transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        >
          <RobotSVG esperando={esperando} />
        </g>
      </svg>

      {/* Estado actual */}
      <div className="simulador-estado">
        <EstadoActual ejecutando={ejecutando} paso={paso} />
      </div>

      <span className="simulador-titulo">Luces del robot</span>
      <PantallaLuces dibujo={luces} />
    </div>
  );
};

export default RobotSimulador;