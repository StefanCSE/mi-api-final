const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../../models/Usuario');

// Endpoint login
router.post('/', async (req, res) => {
  try {
    const { email, contrasenya } = req.body;

    if (!email || !contrasenya) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const esValida = await bcrypt.compare(contrasenya, usuario.contrasenya);

    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'ok',
      token: token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

module.exports = router;
