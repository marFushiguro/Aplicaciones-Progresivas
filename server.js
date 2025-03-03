const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const path = require('path');
const { usersCollection } = require('./config/firebase');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Nueva ruta para perfil de usuario

// Configuración de dotenv para las variables de entorno
dotenv.config();

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);  // Rutas CRUD para usuarios
app.use('/api/auth', authRoutes);   // Ruta para el perfil del usuario autenticado

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
