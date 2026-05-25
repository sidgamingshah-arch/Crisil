const admin = require('firebase-admin');
const logger = require('../utils/logger');

let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    credential = admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
  } else {
    logger.warn('Firebase credentials not configured — using mock in development');
    return null;
  }

  admin.initializeApp({ credential });
  initialized = true;
  logger.info('Firebase Admin initialized');
  return admin;
}

module.exports = { initFirebase, getAdmin: () => admin };
