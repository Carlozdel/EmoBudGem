import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

dotenv.config();

// --- CONFIG DRIVE ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// --- CONFIG ---
const FOLDER_NAME = 'emobud';
const LOCAL_FILE = 'history_2025_07_20.json'; // archivo local que quieres subir
const REMOTE_NAME = 'history_2025_07_20.json'; // nombre que tendrá en Drive

// --- FUNCIONES ---
async function getFolderId() {
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
    fields: 'files(id, name)',
  });
  if (res.data.files.length) return res.data.files[0].id;

  // Crear folder si no existe
  const folder = await drive.files.create({
    resource: { name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id',
  });
  return folder.data.id;
}

async function uploadFile(folderId) {
  const filePath = path.resolve(LOCAL_FILE);
  if (!fs.existsSync(filePath)) throw new Error(`Archivo local no encontrado: ${LOCAL_FILE}`);

  const fileMetadata = {
    name: REMOTE_NAME,
    parents: [folderId],
  };

  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream(filePath),
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });

  return res.data.id;
}

// --- MAIN ---
async function main() {
  try {
    const folderId = await getFolderId();
    console.log('Folder ID:', folderId);

    const fileId = await uploadFile(folderId);
    console.log(`Archivo subido correctamente con ID: ${fileId}`);
  } catch (err) {
    console.error('Error al subir archivo:', err);
  }
}

main();