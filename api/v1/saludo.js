const express = require('express');
const router = express.Router();

// Endpoint de saludo con parametro
router.get('/:nombre', (req, res) => {
  const { nombre } = req.params;
  
  if (!nombre) {
    return res.status(400).json({ error: 'Nombre es requerido' });
  }

  res.json({
    mensaje: `Hola, ${nombre}!`,
    status: 'ok'
  });
});

module.exports = router;
