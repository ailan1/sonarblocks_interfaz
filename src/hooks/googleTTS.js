/**
 * Servicio de Texto a Voz usando Google Cloud TTS
 * @param {string} text - El texto que quieres que la IA diga.
 * @param {string} lang - Código de idioma (opcional, default es-US).
 */
export const speakWithGoogle = async (text, lang = "es-US") => {
  const API_KEY = "AIzaSyCn7tei8YaHo01q9eBz7M2LNBKN3J-nKBQ";
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

  const requestBody = {
    input: { text },
    voice: { 
      languageCode: lang, 
      // Usamos WaveNet-A que es la voz de "maestra" más clara
      name: `${lang}-Wavenet-A`, 
      ssmlGender: "FEMALE" 
    },
    audioConfig: { 
      audioEncoding: "MP3",
      speakingRate: 0.95, // Velocidad ideal para primaria
      pitch: 0.0 
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.audioContent) {
      // Creamos el recurso de audio desde el base64
      const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioSrc);
      
      // Retornamos una promesa que se resuelve cuando el audio termina
      // Esto es útil si quieres hacer algo después de que la IA hable
      return new Promise((resolve) => {
        audio.onended = () => {
          resolve();
        };
        audio.play();
      });
    }
  } catch (error) {
    console.error("Error en Google TTS Service:", error);
  }
};