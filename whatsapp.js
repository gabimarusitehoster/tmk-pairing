const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function startSession(phoneNumber) {
  const sessionFolder = path.join(__dirname, 'sessions', phoneNumber);
  if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    version: [2, 3000, 1023223821]
  });

  const code = await sock.requestPairingCode(phoneNumber);
  sock.ev.on('creds.update', saveCreds);
  return code;
}

module.exports = { startSession }; 
