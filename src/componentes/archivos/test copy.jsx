import React, { useState } from 'react';
//import { useSerialMicrobit } from '../hooks/useSerialMicrobit';

const MicrobitSerialController = () => {
  const {
    conectarMicrobit,
    enviarComando,
    enviarComandoConRespuesta,
    desconectar,
    limpiarDatos,
    estadoConexion,
    ultimoMensaje,
    datosRecibidos,
    puertoActivo,
  } = useSerialMicrobit();

  const [comandoInput, setComandoInput] = useState('');

  const comandosPredefinidos = [
    { label: 'LED ON', cmd: 'LED_ON' },
    { label: 'LED OFF', cmd: 'LED_OFF' },
    { label: 'Temperatura', cmd: 'TEMP' },
    { label: 'Luz', cmd: 'LIGHT' },
    { label: 'Acelerómetro', cmd: 'ACCEL' },
    { label: 'Botones', cmd: 'BUTTONS' },
    { label: 'Beep', cmd: 'BEEP' },
    { label: 'Limpiar', cmd: 'CLEAR' },
  ];

  const handleEnviarComando = async () => {
    if (comandoInput.trim()) {
      await enviarComando(comandoInput);
      setComandoInput('');
    }
  };

  const handleComandoPredefinido = async (cmd) => {
    await enviarComando(cmd);
  };

  const obtenerTelemetria = async () => {
    const respuesta = await enviarComandoConRespuesta('GET_ALL');
    if (respuesta) {
      console.log('Telemetría:', respuesta);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Control micro:bit vía Serial</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Estado: {estadoConexion}</h3>
        
        <button 
          onClick={conectarMicrobit}
          disabled={puertoActivo}
          style={buttonStyle(puertoActivo)}
        >
          Conectar
        </button>
        
        <button 
          onClick={desconectar}
          disabled={!puertoActivo}
          style={buttonStyle(!puertoActivo)}
        >
          Desconectar
        </button>
        
        <button 
          onClick={limpiarDatos}
          style={{ marginLeft: '10px', padding: '10px' }}
        >
          Limpiar Datos
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Comandos Rápidos</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {comandosPredefinidos.map((item, index) => (
            <button
              key={index}
              onClick={() => handleComandoPredefinido(item.cmd)}
              disabled={!puertoActivo}
              style={commandButtonStyle(!puertoActivo)}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={obtenerTelemetria}
            disabled={!puertoActivo}
            style={commandButtonStyle(!puertoActivo)}
          >
            Telemetría
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Enviar Comando Personalizado</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={comandoInput}
            onChange={(e) => setComandoInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarComando()}
            placeholder="Escribe un comando..."
            style={{ flex: 1, padding: '10px' }}
            disabled={!puertoActivo}
          />
          <button
            onClick={handleEnviarComando}
            disabled={!puertoActivo || !comandoInput.trim()}
            style={buttonStyle(!puertoActivo || !comandoInput.trim())}
          >
            Enviar
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Último Mensaje:</h3>
        <div style={{
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          minHeight: '30px'
        }}>
          {ultimoMensaje || "Esperando datos..."}
        </div>
      </div>

      <div>
        <h3>Historial de Datos:</h3>
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#fafafa',
          padding: '10px',
          borderRadius: '5px'
        }}>
          {datosRecibidos.length === 0 ? (
            <p>No hay datos recibidos</p>
          ) : (
            datosRecibidos.map((item, index) => (
              <div key={index} style={{
                padding: '5px',
                borderBottom: '1px solid #eee',
                fontFamily: 'monospace'
              }}>
                <span style={{ color: '#666' }}>[{item.timestamp}] </span>
                <span>{item.data}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Estilos
const buttonStyle = (disabled) => ({
  padding: '10px 20px',
  marginRight: '10px',
  backgroundColor: disabled ? '#ccc' : '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: disabled ? 'not-allowed' : 'pointer',
});

const commandButtonStyle = (disabled) => ({
  padding: '8px 15px',
  backgroundColor: disabled ? '#ccc' : '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: disabled ? 'not-allowed' : 'pointer',
});

export default MicrobitSerialController;