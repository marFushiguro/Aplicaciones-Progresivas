const { rolesCollection } = require('../../config/firebase'); // Importa la colección de roles de Firebase

// Obtener todos los roles
const getRoles = async (req, res) => {
  try {
    const rolesSnapshot = await rolesCollection.get();
    const roles = rolesSnapshot.docs.map(doc => doc.data());
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).send('Error en el servidor');
  }
};

// Crear un nuevo rol (solo admin)
const createRole = async (req, res) => {
  const { role, permissions } = req.body;

  try {
    const roleRef = rolesCollection.doc();
    await roleRef.set({
      role,
      permissions,
    });
    res.status(201).send('Rol creado');
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = { getRoles, createRole };
