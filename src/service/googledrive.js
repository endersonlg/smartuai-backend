import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import credential from '../config/credential';

require('dotenv/config');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const TOKEN_PATH = 'token.json';

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = auth => {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list(
    {
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    },
    (err, res) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const { files } = res.data;
      if (files.length) {
        console.log('Files:');
        files.map(file => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    }
  );
};

async function imageUpload(file, callback) {
  authorize(credential, auth => {
    const fileMetadata = {
      name: file.filename,
      parents: [process.env.GOOGLE_DRIVE_PAST],
    };

    const media = {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.path),
    };

    const drive = google.drive({ version: 'v3', auth });
    drive.files.create(
      {
        resource: fileMetadata,
        media,
        fields: 'id',
      },
      function(err, fileReturn) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          callback(fileReturn);
        }
      }
    );
  });
}

export default {
  SCOPES,
  authorize,
  listFiles,
  imageUpload,
};
