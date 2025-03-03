const firebaseAdmin = require('firebase-admin');
const { usersCollection } = require('../../config/firebase');

// 🔹 Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    console.log('Solicitud GET a /api/users recibida');
    const usersSnapshot = await usersCollection.get();
    if (usersSnapshot.empty) {
      console.log('No se encontraron usuarios en Firestore');
      return res.status(404).json({ 
        success: false, 
        message: 'No se encontraron usuarios' 
      });
    }
    const users = [];
    usersSnapshot.forEach((doc) => {
      console.log('Procesando usuario:', doc.id, doc.data());
      users.push({ 
        uid: doc.id, 
        email: doc.data().email,
        role: doc.data().role,
        username: doc.data().username // Añadir username si existe
      });
    });
    console.log('Usuarios preparados:', users);
    res.status(200).json({ 
      success: true, 
      count: users.length,
      users: users 
    });
  } catch (error) {
    console.error('Error crítico:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
};

// 🔹 Obtener un usuario por UID
const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const userDoc = await usersCollection.doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ uid: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// 🔹 Crear un nuevo usuario
const createUser = async (req, res) => {
  const { email, password, role, username } = req.body; // Incluir username
  try {
    const userRecord = await firebaseAdmin.auth().createUser({ email, password });
    await usersCollection.doc(userRecord.uid).set({
      email,
      role: role || 'user',
      username: username || null // Guardar username si se proporciona
    });
    res.status(201).json({ message: 'Usuario creado correctamente', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

const updateUser = async (req, res) => {
    const { uid } = req.params;
    const { email, role, username } = req.body;
    const currentUser = req.user;

    try {
        if (currentUser.role === 'user' && currentUser.uid !== uid) {
            return res.status(403).json({ message: 'No tienes permiso para editar este perfil' });
        }

        const firestoreUpdateData = {};
        if (currentUser.role === 'admin') {
            if (email) firestoreUpdateData.email = email;
            if (role) firestoreUpdateData.role = role;
            if (username) firestoreUpdateData.username = username;
        } else if (currentUser.role === 'user') {
            if (username) firestoreUpdateData.username = username;
            else {
                return res.status(403).json({ message: 'Solo puedes editar tu nombre de usuario' });
            }
        }

        // 🔑 SINCRONIZACIÓN DEL EMAIL:
        if (email && currentUser.role === 'admin') { // Solo si se está actualizando el email y es admin quien edita
            try {
                // 1. ACTUALIZAR EMAIL EN FIREBASE AUTHENTICATION:
                await firebaseAdmin.auth().updateUser(uid, { email: email }); // 👈 ACTUALIZAR EN AUTHENTICATION

                // 2. ACTUALIZAR EMAIL EN FIRESTORE:
                firestoreUpdateData.email = email; // Ya lo tenías, pero lo repetimos para claridad
                if (Object.keys(firestoreUpdateData).length > 0) {
                    await usersCollection.doc(uid).update(firestoreUpdateData); // 👈 ACTUALIZAR EN FIRESTORE
                }

                res.status(200).json({ message: 'Usuario y email actualizado correctamente (Auth y Firestore)' }); // Mensaje más específico
            } catch (authError) {
                console.error('❌ Error al actualizar email en Firebase Authentication:', authError);
                return res.status(500).json({ message: 'Error al actualizar email en Firebase Authentication', error: authError.message }); // Manejar error de Auth
            }
        } else { // Si NO se está actualizando el email, solo actualiza Firestore (como antes)
            if (Object.keys(firestoreUpdateData).length > 0) {
                await usersCollection.doc(uid).update(firestoreUpdateData);
            }
            res.status(200).json({ message: 'Usuario actualizado correctamente' }); // Mensaje original
        }


    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// 🔹 Eliminar un usuario
const deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    // Eliminar el usuario de Firebase Authentication
    await firebaseAdmin.auth().deleteUser(uid);

    // Eliminar el usuario de Firestore
    await usersCollection.doc(uid).delete();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};