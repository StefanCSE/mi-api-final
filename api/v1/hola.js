const express = require('express');
const router = express.Router();

// Endpoint Hola
router.get('/', (req, res) => {
  res.json({
    mensaje: 'Hola Mundo',
    status: 'ok',
    timestamp: new Date()
  });
});

module.exports = router;