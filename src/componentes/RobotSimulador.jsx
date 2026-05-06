import React, { useEffect, useRef, useState, useMemo } from 'react';

const TAMANO_ARENA = 500;
const PASO_MOVIMIENTO = 60;
const DURACION_PASO = 2800; // ms, más lento

const ROTACION = { norte: -90, sur: 90, este: 0, oeste: 180 };
const DELTA = {
  norte: { x: 0, y: -PASO_MOVIMIENTO },
  sur: { x: 0, y: PASO_MOVIMIENTO },
  este: { x: PASO_MOVIMIENTO, y: 0 },
  oeste: { x: -PASO_MOVIMIENTO, y: 0 },
};
const GIRO_IZQ = { norte: 'oeste', oeste: 'sur', sur: 'este', este: 'norte' };
const GIRO_DER = { norte: 'este', este: 'sur', sur: 'oeste', oeste: 'norte' };
const LABELS = {
  Avanzar: '▶ Avanzando...',
  Izquierda: '↰ Girando izquierda...',
  Derecha: '↱ Girando derecha...',
  Esperar: '⏸ Esperando...',
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

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

const EstadoActual = ({ ejecutando, bloques, ejecutandoIdx }) => {
  if (!ejecutando) return '— En espera —';
  if (ejecutandoIdx === null) return '';
  return LABELS[bloques[ejecutandoIdx]] || '';
};

const RobotSimulador = ({ bloques, ejecutando }) => {
  const centro = TAMANO_ARENA / 2;

  const [pos, setPos] = useState({ x: centro, y: centro });
const [dir, setDir] = useState('este'); // inicia mirando oeste
         // referencia interna
  const [esperando, setEsperando] = useState(false);
  const [rastro, setRastro] = useState([]);
  const [ejecutandoIdx, setEjecutandoIdx] = useState(null);

  const posRef = useRef({ x: centro, y: centro });
  const dirRef = useRef('este'); 

  // Resetear cuando no ejecuta
  useEffect(() => {
    if (!ejecutando) {
      setPos({ x: centro, y: centro });
      setDir('este'); // inicia mirando oeste
      setEsperando(false);
      setRastro([]);
      setEjecutandoIdx(null);
      posRef.current = { x: centro, y: centro };
      dirRef.current = 'este';
    }
  }, [ejecutando]);

  // Animación
  useEffect(() => {
    if (!ejecutando || bloques.length === 0) return;
    let cancelado = false;

    const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

    const animar = async () => {
      posRef.current = { x: centro, y: centro };
      dirRef.current = 'este';
      setPos({ x: centro, y: centro });
      setDir('este');
      setRastro([]);
      setEsperando(false);
      const gradosADELTA = (rot) => {
  // Convertir rotación a radianes
  const rad = (rot * Math.PI) / 180;
  return { x: Math.cos(rad) * PASO_MOVIMIENTO, y: Math.sin(rad) * PASO_MOVIMIENTO };
};

      for (let i = 0; i < bloques.length; i++) {
        if (cancelado) return;
        const bloque = bloques[i];
        if (bloque === 'Al empezar') continue;

        setEjecutandoIdx(i);
        await esperar(500);

        switch (bloque) {
          case 'Avanzar': {
  const delta = gradosADELTA(ROTACION[dirRef.current]); // usar rotación actual
  const nuevaX = clamp(posRef.current.x + delta.x, 20, TAMANO_ARENA - 20);
  const nuevaY = clamp(posRef.current.y + delta.y, 20, TAMANO_ARENA - 20);
  setRastro(prev => [...prev, { x1: posRef.current.x, y1: posRef.current.y, x2: nuevaX, y2: nuevaY }]);
  posRef.current = { x: nuevaX, y: nuevaY };
  setPos({ x: nuevaX, y: nuevaY });
  await esperar(DURACION_PASO);
  break;
}
          case 'Izquierda':
            dirRef.current = GIRO_IZQ[dirRef.current];
            setDir(dirRef.current);
            await esperar(DURACION_PASO);
            break;
          case 'Derecha':
            dirRef.current = GIRO_DER[dirRef.current];
            setDir(dirRef.current);
            await esperar(DURACION_PASO);
            break;
          case 'Esperar':
            setEsperando(true);
            await esperar(DURACION_PASO);
            setEsperando(false);
            break;
        }
      }
      setEjecutandoIdx(null);
    };

    animar();
    return () => {
      cancelado = true;
    };
  }, [ejecutando, bloques]);

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
    <div
      style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 16,
        padding: 16,
        border: '1px solid var(--color-border-tertiary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        minWidth: TAMANO_ARENA + 32,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.03em',
        }}
      >
        Vista del robot
      </span>

      <svg
        width={TAMANO_ARENA}
        height={TAMANO_ARENA}
        style={{ borderRadius: 12, background: '#e8f4ff', display: 'block' }}
        aria-label="Simulador del robot"
      >
        {/* Suelo con puntos */}
        {puntosSuelo.map((p) => (
          <circle key={p.key} cx={p.cx} cy={p.cy} r={2} fill="rgba(100,150,220,0.25)" />
        ))}

        {/* Punto de inicio */}
        <circle
          cx={centro}
          cy={centro}
          r={6}
          fill="rgba(76,151,255,0.2)"
          stroke="#4C97FF"
          strokeWidth={1.5}
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
            stroke="#4C97FF"
            strokeWidth={2.5}
            strokeOpacity={0.35}
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
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', height: 18 }}>
        <EstadoActual ejecutando={ejecutando} bloques={bloques} ejecutandoIdx={ejecutandoIdx} />
      </div>
    </div>
  );
};

export default RobotSimulador;