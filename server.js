const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a mi API Final',
    version: '1.0.0',
    endpoints: [
      '/api/v1/hola',
      '/api/v1/saludo?nombre=TuNombre',
      '/api/v1/usuarios',
      '/api/v1/login',
      '/api/v1/usuarios-protegido'
    ]
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
