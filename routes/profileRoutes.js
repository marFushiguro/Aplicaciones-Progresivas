/*const express = require('express');
const firebaseAdmin = require('firebase-admin');
const { verifyToken } = require('../src/middleware/authMiddleware');
const router = express.Router();

// 🔹 Obtener perfil del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  const uid = req.user.uid?.trim();
  console.log('✅ UID desde el token:', uid);

  try {
    const userDoc = await firebaseAdmin.firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado en Firestore' });
    }

    const userData = userDoc.data();
    const userAuth = await firebaseAdmin.auth().getUser(uid);

    const userProfile = {
      uid: userAuth.uid,
      email: userAuth.email,
      displayName: userAuth.displayName || userData.username,
      role: userData.role || 'user',
      permissions: userData.permissions || [],
      lastLogin: userData.last_login?.toDate() || null,
      createdAt: userAuth.metadata.creationTime,
    };

    res.status(200).json(userProfile);

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// 🔹 Actualizar perfil del usuario
router.put('/', verifyToken, async (req, res) => {
  const uid = req.user.uid?.trim();
  const { displayName, email, username } = req.body;

  try {
    const userDoc = await firebaseAdmin.firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado en Firestore' });
    }

    // Verificar si es un admin para poder editar
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acción no permitida. Solo un administrador puede editar el perfil.' });
    }

    // Actualizar la información en Firestore
    await firebaseAdmin.firestore().collection('users').doc(uid).update({
      displayName: displayName || userDoc.data().displayName,
      email: email || userDoc.data().email,
      username: username || userDoc.data().username,
    });

    // Responder con éxito
    res.status(200).json({ message: 'Perfil actualizado correctamente.' });

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

module.exports = router; */