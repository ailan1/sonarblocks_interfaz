import { useState, useRef, useCallback } from "react";

export const useSerialMicrobit = () => {
  const [estadoConexion, setEstadoConexion] = useState("Desconectado");
  const [ultimoMensaje, setUltimoMensaje] = useState("");
  const [datosRecibidos, setDatosRecibidos] = useState([]);
  const [puertoActivo, setPuertoActivo] = useState(false);
  
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const lectorActivoRef = useRef(false);

  
  const configuracionSerial = {
    baudRate: 115200,  // micro:bit usa 115200 baudios
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    flowControl: "none"
  };

  // Función para leer datos continuamente
  const leerDatosContinuos = useCallback(async () => {
    if (!portRef.current || !portRef.current.readable || lectorActivoRef.current) {
      return;
    }

    lectorActivoRef.current = true;
    const decoder = new TextDecoder();
    
    try {
      while (portRef.current.readable && lectorActivoRef.current) {
        readerRef.current = portRef.current.readable.getReader();
        
        try {
          while (true) {
            const { value, done } = await readerRef.current.read();
            
            if (done) {
              break;
            }
            
            if (value) {
              const texto = decoder.decode(value);
              setUltimoMensaje(texto);
              setDatosRecibidos(prev => [...prev.slice(-50), { 
                timestamp: new Date().toLocaleTimeString(), 
                data: texto.trim() 
              }]);
              console.log("Recibido:", texto);
            }
          }
        } catch (error) {
          console.error("Error leyendo:", error);
        } finally {
          readerRef.current.releaseLock();
        }
      }
    } catch (error) {
      console.error("Error en bucle de lectura:", error);
    } finally {
      lectorActivoRef.current = false;
    }
  }, []);

  // Conectar al puerto serial
  const conectarMicrobit = async () => {
    try {
      // Verificar si Web Serial API está disponible
      if (!("serial" in navigator)) {
        throw new Error("Web Serial API no soportada en este navegador");
      }

      setEstadoConexion("Solicitando puerto...");
      // Solicitar puerto serial
      const port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x0D28, usbProductId: 0x0204 }, // micro:bit v2
          { usbVendorId: 0x0D28, usbProductId: 0x0200 }, // micro:bit v1
        ]
      });

      setEstadoConexion("Conectando...");
      
      // Abrir el puerto
      await port.open(configuracionSerial);
      portRef.current = port;
      
      // Obtener writer
      const writer = port.writable.getWriter();
      writerRef.current = writer;
      
      setPuertoActivo(true);
      setEstadoConexion("Conectado");
      console.log("Puerto serial abierto exitosamente");

      // Iniciar lectura de datos
      leerDatosContinuos();

      // Configurar eventos de desconexión
      port.addEventListener("disconnect", () => {
        desconectar();
      });

    } catch (error) {
      console.error("Error al conectar:", error);
      setEstadoConexion(`Error: ${error.message}`);
      await desconectar();
    }
  };

  // Enviar comando a micro:bit
  const enviarComando = async (comando) => {
    if (!writerRef.current) {
      setEstadoConexion("Error: No conectado");
      return false;
    }

    try {
      const encoder = new TextEncoder();
      
      // Asegurarse de que termine con nueva línea
      let comandoFinal = comando;
      if (!comandoFinal.endsWith("\n")) {
        comandoFinal += "\n";
      }
      
      const data = encoder.encode(comandoFinal);
      await writerRef.current.write(data);
      
      console.log("Enviado:", comandoFinal.trim());
      return true;
    } catch (error) {
      console.error("Error enviando comando:", error);
      setEstadoConexion("Error enviando");
      return false;
    }
  };

  // Enviar comando y esperar respuesta
  const enviarComandoConRespuesta = async (comando, timeout = 3000) => {
    if (!puertoActivo) return null;
    
    const datosAnteriores = [...datosRecibidos];
    
    await enviarComando(comando);
    
    return new Promise((resolve) => {
      const inicio = Date.now();
      const interval = setInterval(() => {
        // Buscar nueva respuesta
        const nuevosDatos = datosRecibidos.slice(datosAnteriores.length);
        if (nuevosDatos.length > 0) {
          clearInterval(interval);
          resolve(nuevosDatos.map(d => d.data).join("\n"));
        }
        
        // Timeout
        if (Date.now() - inicio > timeout) {
          clearInterval(interval);
          resolve(null);
        }
      }, 100);
    });
  };

  // Desconectar
  const desconectar = async () => {
    try {
      // Detener lectura
      lectorActivoRef.current = false;
      
      // Cerrar reader
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current.releaseLock();
      }
      
      // Cerrar writer
      if (writerRef.current) {
        await writerRef.current.close();
        writerRef.current = null;
      }
      
      // Cerrar puerto
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      
      setPuertoActivo(false);
      setEstadoConexion("Desconectado");
      setDatosRecibidos([]);
      console.log("Desconectado exitosamente");
      
    } catch (error) {
      console.error("Error al desconectar:", error);
    }
  };

  // Limpiar datos recibidos
  const limpiarDatos = () => {
    setDatosRecibidos([]);
  };

  return {
    conectarMicrobit,
    enviarComando,
    enviarComandoConRespuesta,
    desconectar,
    limpiarDatos,
    estadoConexion,
    ultimoMensaje,
    datosRecibidos,
    puertoActivo,
    estaConectado: puertoActivo,
  };
};