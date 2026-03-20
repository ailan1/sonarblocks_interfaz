// RealHexInjector.jsx
import React, { useState, useRef } from 'react';

const RealHexInjector = () => {
  const [code, setCode] = useState(`// Código que se INYECTARÁ en el HEX
basic.showString("Hola Micro:bit!", 150);
led.plot(2, 2);
music.playTone(440, 500);`);
  
  const [programName, setProgramName] = useState('microbit-app');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hexInfo, setHexInfo] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = 'http://localhost:3001';

  const generateHex = async () => {
    if (!code.trim()) {
      setMessage('❌ Escribe algún código primero');
      return;
    }

    setIsLoading(true);
    setMessage('Generando HEX completo...');

    try {
      const response = await fetch(`${API_URL}/api/generate-real-hex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, programName })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      // Descargar
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${programName}.hex`;
      a.click();
      
      // Mostrar info
      const text = await blob.text();
      setHexInfo({
        lines: text.split('\n').length,
        size: blob.size,
        preview: text.substring(0, 200) + '...'
      });
      
      setMessage(`✅ HEX generado: ${blob.size} bytes`);
      
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadTemplate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.hex')) {
      setMessage('❌ Solo archivos .hex');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setMessage(`📂 Template cargado: ${content.length} bytes`);
      
      // Podrías enviar este template al backend
      console.log('Template cargado:', content.substring(0, 100));
    };
    reader.readAsText(file);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🔧 Inyector de Código HEX para Micro:bit</h1>
        <p>Genera archivos .hex COMPLETOS como MakeCode</p>
      </header>

      <div style={styles.main}>
        {/* Subir template HEX real */}
        <div style={styles.uploadSection}>
          <h3>📁 Usar HEX real como base (opcional):</h3>
          <input
            type="file"
            ref={fileInputRef}
            onChange={uploadTemplate}
            accept=".hex"
            style={styles.fileInput}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={styles.uploadButton}
          >
            📂 Subir HEX de MakeCode
          </button>
          <small>Carga un .hex real para usarlo como plantilla</small>
        </div>

        {/* Editor */}
        <div style={styles.editorSection}>
          <h3>📝 Tu código JavaScript:</h3>
          <textarea
            style={styles.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="10"
            placeholder="basic.showString('Hola!');"
          />
          
          <div style={styles.controls}>
            <div style={styles.nameInput}>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="nombre-programa"
                style={styles.nameField}
              />
              <span>.hex</span>
            </div>
            
            <button
              onClick={generateHex}
              disabled={isLoading}
              style={styles.generateButton}
            >
              {isLoading ? '⚙️ Generando HEX completo...' : '⚡ Generar HEX REAL'}
            </button>
          </div>
        </div>

        {/* Info del HEX generado */}
        {hexInfo && (
          <div style={styles.hexInfo}>
            <h3>📊 HEX generado:</h3>
            <div style={styles.stats}>
              <div><strong>Tamaño:</strong> {hexInfo.size} bytes</div>
              <div><strong>Líneas:</strong> {hexInfo.lines}</div>
            </div>
            <pre style={styles.preview}>
              {hexInfo.preview}
            </pre>
          </div>
        )}

        {/* Mensajes */}
        {message && (
          <div style={message.includes('✅') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        {/* Comparación */}
        <div style={styles.comparison}>
          <h3>🔄 Comparación con MakeCode:</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Característica</th>
                <th>MakeCode</th>
                <th>Nuestro Generador</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Firmware incluido</td>
                <td>✅ Completo (~256KB)</td>
                <td>✅ Simulado (~64KB)</td>
              </tr>
              <tr>
                <td>Bootloader</td>
                <td>✅ Sí</td>
                <td>⚠️ Parcial</td>
              </tr>
              <tr>
                <td>Runtime MakeCode</td>
                <td>✅ Sí</td>
                <td>❌ No</td>
              </tr>
              <tr>
                <td>Tu código</td>
                <td>✅ Compilado</td>
                <td>✅ Inyectado como texto</td>
              </tr>
              <tr>
                <td>Líneas HEX</td>
                <td>~8,000-10,000</td>
                <td>~100-200</td>
              </tr>
            </tbody>
          </table>
          
          <div style={styles.note}>
            <strong>💡 Nota:</strong> Para HEX 100% funcional, necesitas compilar 
            con <code>pxt-microbit</code> o usar el editor en línea de MakeCode.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '25px',
    background: 'linear-gradient(135deg, #0d47a1, #1565c0)',
    color: 'white',
    borderRadius: '12px'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  uploadSection: {
    background: '#e3f2fd',
    padding: '20px',
    borderRadius: '10px',
    border: '2px dashed #2196f3'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    padding: '12px 24px',
    background: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '10px 0'
  },
  editorSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)'
  },
  textarea: {
    width: '100%',
    padding: '20px',
    fontFamily: '"Consolas", "Monaco", monospace',
    fontSize: '14px',
    border: '2px solid #bbdefb',
    borderRadius: '8px',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'center'
  },
  nameInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1
  },
  nameField: {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '16px',
    flex: 1
  },
  generateButton: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #00c853, #00e676)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    minWidth: '200px'
  },
  hexInfo: {
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px'
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px'
  },
  preview: {
    background: '#2c3e50',
    color: '#ecf0f1',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '12px',
    overflowX: 'auto'
  },
  success: {
    padding: '15px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    border: '1px solid #c3e6cb'
  },
  error: {
    padding: '15px',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    border: '1px solid #f5c6cb'
  },
  comparison: {
    background: '#fff8e1',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #ffd54f'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0'
  },
  tableTh: {
    background: '#ffd54f',
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ffb300'
  },
  tableTd: {
    padding: '12px',
    border: '1px solid #ffe082',
    background: 'white'
  },
  note: {
    marginTop: '20px',
    padding: '15px',
    background: '#e8f5e9',
    borderRadius: '6px',
    borderLeft: '4px solid #4caf50'
  }
};

export default RealHexInjector;