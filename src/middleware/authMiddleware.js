// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { usersCollection } = require('../../config/firebase');


//verificar el token de autenticación
//Daniela Peña Rangel 
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No hay token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    try {
      const userDoc = await usersCollection.doc(decoded.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const userData = userDoc.data();
      req.user = {
        uid: decoded.uid,
        role: userData.role || 'user',
        permissions: userData.permissions || [],
      };
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  });
};

//verificar permisos específicos de usuario
const verifyPermission = (permission) => {
  return (req, res, next) => {
    console.log('Usuario:', req.user); 
    console.log('Permisos del usuario:', req.user.permissions); 
    if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Acceso denegado: permiso insuficiente' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyPermission };
