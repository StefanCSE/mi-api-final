const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcryptjs');
const verificarToken = require('../../middleware/auth');

// POST para crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, contrasenya } = req.body;

    if (!nombre || !email || !contrasenya) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasyaHash = await bcrypt.hash(contrasenya, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasenya: contrasyaHash
    });

    await nuevoUsuario.save();
    res.status(201).json({
      status: 'ok',
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// GET para obtener todos los usuarios (protegido con JWT)
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contraseña');
    res.json({
      status: 'ok',
      usuarios: usuarios
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
