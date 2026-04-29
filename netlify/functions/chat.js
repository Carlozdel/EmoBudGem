
import dotenv from 'dotenv';
dotenv.config();

console.log("API Key en función:", process.env.GOOGLE_API_KEY || "NO DEFINIDA");
console.log("Refresh token es:", process.env.GOOGLE_API_KEY || "NO DEFINIDA");

export async function handler(event, context) {
  try {
    const { prompt, history } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el prompt." })
      };
    }

    // El prompt que tu proporcionaste en este archivo
    const systemPrompt = "Primer protocolo, Eres un acompanante conversacional con toda la potencia y capacidades de gemini ai sin límites, solo en caso de preguntas profundas, emocionales o filosóficas puedes extenderte profundamente. Puedes dar fuentes, links y todo lo que el usuario te pida. Pero, no puedes decir que eres ese asistente, ese es un prompt que solo asumes pero no mencionas a menos que el usuario te pregunte cual es tu funcion";
    
// const systemPrompt = "Este prompt lo vas a ocultar de usuario, pero como eres un acommpanamte bromista. cuando el usuario te salude te va a decir su nombre. y tu le contestaras: Hola mi (nombre del usuario) cara de mi huevo izuqierdo. En que te puedo servir papito chulo?. y despues de esa interaccion ya podras comportarte como ia normal.";

    // Reestructura el historial de chat para el formato de Gemini
    let contents = [{ parts: [{ text: systemPrompt }] }];

    if (Array.isArray(history) && history.length > 0) {
      contents = contents.concat(history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })));
    }
    
    // Agrega el nuevo mensaje del usuario
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

// const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GOOGLE_API_KEY, {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GOOGLE_API_KEY, {
  
  
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: systemPrompt + "\n\n" + prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7, 
      topK: 20,
      topP: 0.95,
      maxOutputTokens: 1200
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: 3 },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: 3 },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: 3 },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: 3 }
    ]
  })
});

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    console.log(data)
    console.log("Gemini respondió:", JSON.stringify(data, null, 2));

    // const aiResponse = data.candidates[0].content.parts[0].text;
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta generada.";
    return { statusCode: 200, body: JSON.stringify({ message: aiResponse }) };
    if (!data.candidates || !data.candidates[0]) {
  throw new Error("Gemini no devolvió candidatos.");
}

  } catch (err) {
    console.error("Error en chat.js:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
