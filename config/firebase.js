const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

// Inicializar Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  
});

const db = firebaseAdmin.firestore();
const usersCollection = db.collection('users');  // Asegúrate de que esta sea la colección que necesitas

module.exports = { firebaseAdmin, usersCollection };
