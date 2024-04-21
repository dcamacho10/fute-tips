const nodemailer = require('nodemailer');
const { google } = require('googleapis'); // Assuming you're using googleapis

// Environment variables (replace with your actual values)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;  // Placeholder like http://localhost:3000/oauth2callback
const EMAIL_ID = process.env.EMAIL_ID; // Your Gmail address

// Function to generate authorization URL (replace scopes if needed)
function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/gmail.send'];

  return `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${scopes.join(' ')}` +
    `&access_type=offline`;
}

// (Assuming you have a mechanism to handle user authorization and retrieve the authorization code)
async function obtainTokens(authorizationCode) {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  try {
    const { tokens } = await oAuth2Client.getToken(authorizationCode);
    return tokens;  // { access_token: "...", refresh_token: "..." }
  } catch (error) {
    console.error("Error obtaining tokens:", error);
    throw error;  // Re-throw for proper error handling
  }
}

// Function to create the Nodemailer transporter with access token
async function createTransporter(accessToken) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: EMAIL_ID,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      accessToken,
    },
  });
}

// Send email function (assuming you have a way to call this after obtaining access token)
async function sendEmail(accessToken) {
  const transporter = await createTransporter(accessToken);

  const info = await transporter.sendMail({
    from: `fute-tips<${EMAIL_ID}>`, // sender address
    to: "diogocamacho10@msn.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

// Example usage (replace with your actual logic for handling authorization and tokens)
(async () => {
  function handleAuthorization() {
    const authorizationUrl = getAuthUrl();
    window.location.href = authorizationUrl; // Redirect the user's browser
  }

  // (Assuming you have a mechanism to handle the redirect from Google)
  function handleRedirect(queryParams) {
    // Extract the authorization code from the query parameters
    const authorizationCode = queryParams.code;

    // Now you can call the obtainTokens function to exchange the code for tokens
    obtainTokens(authorizationCode)
      .then(tokens => {
        // Use the obtained tokens (access_token and refresh_token)
        // ... (Your code to create transporter and send emails) ...
      })
      .catch(error => {
        console.error("Error obtaining tokens:", error);
        // Handle the error appropriately (e.g., display an error message to the user)
      });
  }
  const tokens = await obtainTokens(authorizationCode);
  const transporter = await createTransporter(tokens.access_token);

  // Now you can send emails using the transporter with access token
  await sendEmail(tokens.access_token);
})();
