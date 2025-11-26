import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 8888;
const PORT = process.env.PORT || 3000;


// Necesario para que funcione __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta raíz
// app.use(express.static(__dirname));

// Ruta principal para mostrar el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de callback OAuth
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  console.log('Código recibido de Google:', code);
  res.send('¡Código recibido! Revísalo en la terminal y guarda tu refresh_token.');
});
// app.use(express.static('.'));
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});process.stdin.resume();
