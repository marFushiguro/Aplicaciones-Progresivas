const express = require('express');
const { getRoles, createRole } = require('../src/controllers/roleController');
const { verifyToken, verifyPermission } = require('../src/middleware/authMiddleware');
const router = express.Router();

// Obtener roles
router.get('/', verifyToken, verifyPermission('get_role'), getRoles);

// Crear un nuevo rol (solo admin)
router.post('/', verifyToken, verifyPermission('add_role'), createRole);

module.exports = router;
