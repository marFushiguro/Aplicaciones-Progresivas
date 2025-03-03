const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser, 
    deleteUser,
} = require('../src/controllers/userController');
const { verifyToken, verifyPermission } = require('../src/middleware/authMiddleware');

//  Permiso  edit_profile 
const permisoEditarPerfil = verifyPermission('edit_profile'); // compart

router.put('/me', verifyToken, permisoEditarPerfil, (req, res, next) => { 
    console.log(' Middleware adicional en /me: Verificando que el usuario edita su propio perfil');
    console.log(' Usuario autenticado (req.user.uid):', req.user.uid);
    console.log(' UID de la ruta (req.params.uid - debería estar vacío inicialmente):', req.params.uid);

  
    req.params.uid = req.user.uid; // MISMO USUARIO? 
    console.log('✅  Forzando req.params.uid a req.user.uid. Nuevo req.params.uid:', req.params.uid);


    if (req.params.uid !== req.user.uid) {
        console.warn('  , hay una discrepancia (N si el código anterior funciona)');
        return res.status(400).json({ message: 'Error interno: Intento de editar perfil incorrecto' }); // Devuelve un error si hay discrepancia INESPERADA
    }

    console.log('✅  Usuario validado para editar su propio perfil en /me. Continuando a updateUser...');
    next(); 
}, updateUser); 


//  PARA ADMINISTRADORES:  Editar CUALQUIER usuario 
router.put('/:uid', verifyToken, permisoEditarPerfil, updateUser); // 


// Obtener todos los usuarios (solo admin - SIN CAMBIOS)
router.get('/', verifyToken, verifyPermission('manage_users'), getUsers);

// Obtener un usuario por su ID (solo admin - SIN CAMBIOS)
router.get('/:uid', verifyToken, verifyPermission('manage_users'), getUserById);

// Crear un nuevo usuario (solo admin - SIN CAMBIOS)
router.post('/', verifyToken, verifyPermission('manage_users'), createUser);

// Eliminar un usuario (solo admin - SIN CAMBIOS)
router.delete('/:uid', verifyToken, verifyPermission('delete_user'), deleteUser);

module.exports = router;