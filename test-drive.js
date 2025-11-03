import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// ¡Aquí está la clave! Asigna el refresh token correctamente
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

async function testCreateFile() {
  try {
    const response = await drive.files.create({
      resource: { name: `diario-${Date.now()}.json`, mimeType: 'application/json' },
      media: { mimeType: 'application/json', body: JSON.stringify({ test: 'hola' }) },
      fields: 'id'
    });
    console.log('Archivo creado con ID:', response.data.id);
  } catch (err) {
    console.error('Error creando archivo en Drive:', err);
  }
}

testCreateFile();