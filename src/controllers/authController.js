const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const firebaseAdmin = require('firebase-admin');
const { usersCollection } = require('../../config/firebase'); // Importa la colección de usuarios de Firebase

// 🔹 REGISTRO DEL USUARIO
const register = async (req, res) => {
  console.log("🔹 Datos recibidos en la petición de registro:", req.body); // Log para debug
  const { email, password, username, role } = req.body;
  const userRole = role || "user"; // Por defecto, el rol es "user"

  try {
    // Verificar si el usuario ya existe en Firestore
    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear usuario en Firebase Auth
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Definir los permisos según el rol del usuario
    const permissions = userRole === "admin"
      ? ["manage_users", "delete_user", "edit_profile"] // Permisos para admin
      : ["edit_profile"]; // Permisos para user

    // Guardar datos del usuario en Firestore usando el UID como ID del documento
    const userData = {
      uid: userRecord.uid,  // ✅ Guardamos el UID en Firestore
      email,
      username,
      password: hashedPassword,
      role: userRole,
      permissions, // Asignamos los permisos según el rol
    };

    // Usa el UID como ID del documento
    await usersCollection.doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "Usuario registrado con éxito",
      userId: userRecord.uid,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 🔹 LOGIN DEL USUARIO
const login = async (req, res) => {
  console.log("🔑 req.body recibido en login:", req.body); // 🔑 Log 1: Inspeccionar req.body al inicio
  const { email, password } = req.body;
  console.log("🔎 Valor de email antes de la consulta Firestore:", email); // 🔎 Log 2: Inspeccionar 'email' antes de la consulta

  try {
    const userSnapshot = await usersCollection.where('email', '==', email).get(); // Línea 55 (posible error)
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const hashedPassword = user.password;

    if (!hashedPassword) {
      return res.status(500).json({ message: 'El usuario no tiene una contraseña guardada' });
    }

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si no tienes el `uid` en Firestore, lo obtenemos desde Firebase Auth
    let uid = user.uid;
    if (!uid) {
      const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
      uid = userRecord.uid;

      // Actualizamos Firestore para guardar el `uid`
      await userDoc.ref.update({ uid });
    }

    // Ahora incluimos el `uid` en el JWT
    const token = jwt.sign(
      {
        uid,  // ✅ Aquí es donde se agrega el UID
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (error) {
    console.error('❌ Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, register };