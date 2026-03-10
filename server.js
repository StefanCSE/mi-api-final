const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const YAML = require('yamljs');
const path = require('path');

const holaRoutes = require('./api/v1/hola');
const saludoRoutes = require('./api/v1/saludo');
const usuariosRoutes = require('./api/v1/usuarios');
const loginRoutes = require('./api/v1/login');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conexion MongoDB
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('MongoDB conexion exitosa');
  } catch (err) {
    console.error('Error de MongoDB:', err.message);
    throw err;
  }
}

// Middleware que conecta a MongoDB antes de cada request que lo necesite
app.use(async (req, res, next) => {
  const rutasSinDB = ['/', '/api-docs', '/api/v1/hola'];
  const necesitaDB = !rutasSinDB.some(r => req.path === r) && !req.path.startsWith('/api/v1/saludo');
  if (necesitaDB) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ error: 'Error de conexion a la base de datos', detalle: err.message });
    }
  }
  next();
});

// Configuracion de Swagger
let swaggerDocument;
try {
    const swaggerPath = path.resolve(process.cwd(), 'swagger.yaml');
    swaggerDocument = YAML.load(swaggerPath);
} catch (e) {
    console.error("No se pudo cargar swagger.yaml:", e.message);
}

// Endpoint de documentacion
app.get('/api-docs', (req, res) => {
  if (!swaggerDocument) return res.status(500).send("Error cargando swagger.yaml");
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mi API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerDocument)},
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis],
            });
          };
        </script>
      </body>
    </html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Uso de rutas
app.use('/api/v1/hola', holaRoutes);
app.use('/api/v1/saludo', saludoRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/login', loginRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a mi API - Funcionando correctamente',
    version: '1.0.0',
    endpoints: [
      '/api/v1/hola',
      '/api/v1/saludo/TuNombre',
      '/api/v1/usuarios',
      '/api/v1/login'
    ]
  });
});

module.exports = app;