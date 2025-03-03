const admin = require('firebase-admin');
const db = admin.firestore(); // Si estás usando Firestore, usa esta línea
// const db = admin.database(); // Si estás usando Realtime Database, usa esta línea

// Crear un nuevo usuario
const createUser = async (userData) => {
  try {
    const { username, email, password, role } = userData;
    
    // Verificar si el email ya existe
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();
    
    if (!snapshot.empty) {
      throw new Error('El email ya está registrado');
    }

    // Crear usuario en Firestore (si no existe)
    const newUserRef = db.collection('users').doc();
    const user = {
      username,
      email,
      password, // Asegúrate de cifrar la contraseña antes de guardarla
      role, // Referencia al documento del rol
      last_login: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await newUserRef.set(user);
    return newUserRef.id; // Retorna el ID del nuevo usuario
  } catch (error) {
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
};

// Obtener todos los usuarios
const getUsers = async () => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    throw new Error(`Error al obtener los usuarios: ${error.message}`);
  }
};

// Obtener un usuario por su email
const getUserByEmail = async (email) => {
  try {
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();
    
    if (snapshot.empty) {
      throw new Error('Usuario no encontrado');
    }

    const user = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...user };
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
};

// Actualizar un usuario
const updateUser = async (userId, updatedData) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update(updatedData);
    return `Usuario con ID ${userId} actualizado exitosamente`;
  } catch (error) {
    throw new Error(`Error al actualizar el usuario: ${error.message}`);
  }
};

// Eliminar un usuario
const deleteUser = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.delete();
    return `Usuario con ID ${userId} eliminado exitosamente`;
  } catch (error) {
    throw new Error(`Error al eliminar el usuario: ${error.message}`);
  }
};

// Exportar las funciones
module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser
};
