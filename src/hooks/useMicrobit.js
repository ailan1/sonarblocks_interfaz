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
  // anunciar: false cuando quien llama ya explica los pasos (el tutorial)
  const conectarMicrobit = async ({ anunciar = true } = {}) => {
    if (!navigator.bluetooth) {
      setEstadoConexion("Bluetooth no disponible");
      hablar(narrativa.SINBLUETOOTH);
      return;
    }

    // Si ya está conectado, no abrir la ventana otra vez (el chico se perdería en ella)
    if (estaConectado) {
      hablar(narrativa.YACONECTADO);
      return;
    }

    // Se explica la ventana del navegador cada vez, no solo en el tutorial.
    // Va antes de requestDevice y sin await: la ventana debe abrirse
    // dentro del mismo evento de teclado o clic.
    if (anunciar) hablar(`${narrativa.INTRUCCIONESCONECTAR} ${narrativa.VENTANACONEXION}`);

    try {
      setEstadoConexion("Buscando...");

      // Filtro optimizado para que aparezca en la lista
      const nombre = "BBC micro:bit";
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: nombre }
        ],
        optionalServices: [UART_SERVICE]
      });

      setEstadoConexion("Conectando al servidor...");
      deviceRef.current = device;

      // Listener para desconexiones accidentales (se quita antes por si es una reconexión)
      device.removeEventListener('gattserverdisconnected', onDesconectado);
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
      // NotFoundError = se cerró la ventana sin elegir un robot
      setEstadoConexion(error.name === "NotFoundError" ? "Desconectado" : "No se pudo conectar");
      setEstaConectado(false);
      hablar(narrativa.ERRORCONEXION);
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
  // useCallback: la misma función en cada render, así removeEventListener la encuentra
  const onDesconectado = useCallback(() => {
    setEstaConectado(false);
    setEstadoConexion("Desconectado");
    hablar(narrativa.DESCONECTADO);
    caracteristicaEnviarRef.current = null;
  }, [hablar, narrativa]);

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