const express = require('express');
const jwt = require('jsonwebtoken');
const firebaseAdmin = require('firebase-admin');
const { login, register } = require('../src/controllers/authController'); // Importa los controladores
const router = express.Router();

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header
  console.log('🔑 Token recibido en verifyToken:', token); // 👈 AÑADE ESTE console.log

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Error al verificar el token:', err); // Log de errores de verificación
      return res.status(403).json({ message: 'Token inválido' });
    }
    console.log('✅ Token decodificado:', decoded); // 👈 AÑADE ESTE console.log
    req.user = decoded; // Agregar los datos decodificados del usuario al request
    next();
  });
};

// Ruta de login
router.post('/login', login);

// Ruta de registro
router.post('/register', register);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', verifyToken, async (req, res) => {
  console.log('🔑 req.user.uid en /profile:', req.user.uid); // 👈 AÑADE ESTE console.log

  try {
    // Obtener información del usuario desde Firebase Authentication
    const userRecord = await firebaseAdmin.auth().getUser(req.user.uid);
    console.log('👤 Usuario encontrado en Firebase Auth:', userRecord);

    // Obtener información adicional del usuario desde Firestore
    const userDoc = await firebaseAdmin.firestore().collection('users').doc(req.user.uid).get();
    console.log('📄 Documento encontrado en Firestore:', userDoc.data()); // 👈 AÑADE ESTE console.log

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado en Firestore' });
    }

    const userData = userDoc.data();
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      username: userData.username,
      role: userData.role,
      permissions: userData.permissions,
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
  }
});

module.exports = router;