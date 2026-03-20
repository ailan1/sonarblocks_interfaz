import { useState, useRef, useCallback } from "react";
import { useAudio } from "./useAudio";

export const useMicrobit = () => {
  const [estadoConexion, setEstadoConexion] = useState("Desconectado");
  const [ultimoMensaje, setUltimoMensaje] = useState("");
  const [estaConectado, setEstaConectado] = useState(false);
  const { hablar,narrativa,pararAudio} = useAudio();
  // Referencias para persistir objetos entre renders sin disparar ciclos infinitos
  const deviceRef = useRef(null);
  const caracteristicaEnviarRef = useRef(null);
  const bufferRef = useRef("");

  // UUIDs Estándar de micro:bit (Servicio UART)
  const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  const UART_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // micro:bit -> Web (Notificaciones)
  const UART_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // Web -> micro:bit (Escritura)

  // =============================
  // PROCESAR DATOS ENTRANTES
  // =============================
  const handleRxData = useCallback((event) => {
    const value = event.target.value;
    const decoder = new TextDecoder();
    const chunk = decoder.decode(new Uint8Array(value.buffer));

    bufferRef.current += chunk;

    // Si llega un salto de línea, procesamos el mensaje completo
    if (bufferRef.current.includes("\n")) {
      const mensajes = bufferRef.current.split("\n");
      bufferRef.current = mensajes.pop(); // Guardar resto incompleto
      
      mensajes.forEach(m => {
        const limpio = m.trim();
        if (limpio) setUltimoMensaje(limpio);
      });
    }
  }, []);

  // =============================
  // CONECTAR
  // =============================
  const conectarMicrobit = async () => {
    try {
      setEstadoConexion("Buscando...");

      // Filtro optimizado para que aparezca en la lista
      console.log(localStorage.getItem("microbit"))
      const nombre = "BBC micro:bit "+ localStorage.getItem("microbit");
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: nombre }
        ],
        optionalServices: [UART_SERVICE]
      });

      setEstadoConexion("Conectando al servidor...");
      deviceRef.current = device;

      // Listener para desconexiones accidentales
      device.addEventListener('gattserverdisconnected', onDesconectado);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(UART_SERVICE);

      // 1. Canal para RECIBIR (TX de la microbit)
      const txChar = await service.getCharacteristic(UART_TX);
      await txChar.startNotifications();
      txChar.addEventListener("characteristicvaluechanged", handleRxData);

      // 2. Canal para ENVIAR (RX de la microbit)
      const rxChar = await service.getCharacteristic(UART_RX);
      caracteristicaEnviarRef.current = rxChar;

      setEstaConectado(true);
      setEstadoConexion("Conectado");
      pararAudio()
      hablar(narrativa.ROBOBITCONECTADO);

    } catch (error) {
      console.error("Error de conexión Bluetooth:", error);
      setEstadoConexion("Error: " + error.message);
      setEstaConectado(false);
    }
  };

  // =============================
  // ENVIAR DATOS
  // =============================
  const enviarComando = async (comando) => {
    if (!caracteristicaEnviarRef.current) {
      console.warn("No hay conexión activa");
      return;
    }

    try {
      const encoder = new TextEncoder();
      // Agregamos \n porque la micro:bit lo usa para saber que el mensaje terminó
      const datos = encoder.encode(comando + "\n");
      await caracteristicaEnviarRef.current.writeValue(datos);
      console.log("Enviado:", comando);
    } catch (error) {
      console.error("Error al enviar comando:", error);
    }
  };

  // =============================
  // DESCONECTAR
  // =============================
  const onDesconectado = () => {
    setEstaConectado(false);
    setEstadoConexion("Desconectado");
    hablar(narrativa.DESCONECTADO)
    caracteristicaEnviarRef.current = null;
  };

  const desconectar = () => {
    if (deviceRef.current && deviceRef.current.gatt.connected) {
      deviceRef.current.gatt.disconnect();
    }
  };

  return {
    conectarMicrobit,
    enviarComando,
    desconectar,
    estadoConexion,
    ultimoMensaje,
    estaConectado,
  };
};