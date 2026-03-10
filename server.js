const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conexion lazy a MongoDB (patron recomendado para serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 10000,
  });
  isConnected = true;
}

// Importar rutas (sin DB en el momento del require)
const holaRoutes = require('./api/v1/hola');
const saludoRoutes = require('./api/v1/saludo');
const usuariosRoutes = require('./api/v1/usuarios');
const loginRoutes = require('./api/v1/login');

// Endpoint de documentacion con swagger-ui-express
let swaggerSetup = null;
try {
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerPath = path.join(__dirname, 'swagger.yaml');
  if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    swaggerSetup = true;
  }
} catch (e) {
  app.get('/api-docs', (req, res) => {
    res.status(500).json({ error: 'Error cargando documentacion', detalle: e.message });
  });
}

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a mi API - Funcionando correctamente',
    version: '1.0.0',
    endpoints: [
      '/api/v1/hola',
      '/api/v1/saludo/TuNombre',
      '/api/v1/usuarios',
      '/api/v1/login',
      '/api-docs'
    ]
  });
});

// Rutas sin base de datos
app.use('/api/v1/hola', holaRoutes);
app.use('/api/v1/saludo', saludoRoutes);

// Middleware de conexion DB solo para rutas que lo necesitan
app.use(['/api/v1/usuarios', '/api/v1/login'], async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Error de conexion a la base de datos', detalle: err.message });
  }
});

// Rutas con base de datos
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/login', loginRoutes);

module.exports = app;