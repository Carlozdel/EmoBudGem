import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 8888;

app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  console.log('Código recibido de Google:', code);
  res.send('¡Código recibido! Revísalo en la terminal y guarda tu refresh_token.');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});