const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

dotenv.config();

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

export async function handler(event, context) {
  try {
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    // 1️⃣ Buscar folder "emobud"
    const folderName = 'emobud';
    let folderId;

    const folderList = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (folderList.data.files.length > 0) {
      folderId = folderList.data.files[0].id;
      console.log('Folder existente encontrado:', folderId);
    } else {
      // Crear folder si no existe
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };
console.log("Credenciales OAuth2:", oAuth2Client.credentials);      
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });
      folderId = folder.data.id;
      console.log('Folder creado:', folderId);
    }

    // 2️⃣ Crear archivo dentro del folder
    const history = JSON.parse(event.body);

    // const fileMetadata = {
    //   name: `diario-${Date.now()}.json`,
    //   mimeType: 'application/json',
    //   parents: [folderId], // <- asignamos el folder
    // };
const now = new Date();
const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
const fileMetadata = {
  name: `diario-${formattedDate}.json`,
  mimeType: 'application/json',
  parents: [folderId],
};
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(history, null, 2),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('Archivo creado con ID:', response.data.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, folderId, fileId: response.data.id }),
    };
  } 
  
  
  // catch (error) {
  //   console.error('Error al guardar en Drive:', error);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ success: false, error: error.message }),
  //   };
  // }
catch (error) {
  console.error("Error detallado guardando en Drive:", error);
  return {
    statusCode: 500,
    body: JSON.stringify({ success: false, error: error.message || error.toString() })
  };
}


}