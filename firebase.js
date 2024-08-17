const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

const fb = initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = { fb, db };
  