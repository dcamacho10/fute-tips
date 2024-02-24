// //Feature pro futuro

// import { google } from 'googleapis';
// import dotenv from 'dotenv'
// import path from 'path'
// import fs from 'fs';
// import http from 'http'
// import url from 'url'
// //TODO encontrar uma forma de importa a biblioteca open sem usar require
// //import open from 'open';
// dotenv.config();

// const people = google.people('v1');
// const keyPath = path(process.env.PATH_TO_GOOGLE_CREDENTIALS);
// let keys = { redirect_uris: [''] };
// if (fs.existsSync(keyPath)) {
//   keys = require(keyPath).web;
// }


// /**
//  * Create a new OAuth2 client with the configured keys.
//  */
// const oauth2Client = new google.auth.OAuth2(
//   keys.client_id,
//   keys.client_secret,
//   keys.redirect_uris[0]
// );

// google.options({ auth: oauth2Client });

// async function authenticate(scopes) {
//   return new Promise((resolve, reject) => {
//     // grab the url that will be used for authorization
//     const authorizeUrl = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes.join(' '),
//     });
//     const server = http
//       .createServer(async (req, res) => {
//         try {
//           if (req.url.indexOf('/oauth2callback') > -1) {
//             const qs = new url.URL(req.url, 'http://localhost:3000')
//               .searchParams;
//             res.end('Authentication successful! Please return to the console.');
//             server.destroy();
//             const { tokens } = await oauth2Client.getToken(qs.get('code'));
//             oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
//             resolve(oauth2Client);
//           }
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .listen(3000, () => {
//         // open the browser to the authorize url to start the workflow
//         open(authorizeUrl, { wait: false }).then(cp => cp.unref());
//       });
//     destroyer(server);
//   });
// }


// export async function saveOnGoogleDrive() {

// }
