const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const YAML = require('yamljs');
const path = require('path');

// 1. IMPORTAR RUTAS (Hazlo aquí arriba para evitar errores de undefined)
const holaRoutes = require('./api/v1/hola');
const saludoRoutes = require('./api/v1/saludo');
const usuariosRoutes = require('./api/v1/usuarios');
const loginRoutes = require('./api/v1/login');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conexion exitosa'))
  .catch(err => console.log('Error de MongoDB:', err));

// Configuración de Swagger
let swaggerDocument;
try {
    const swaggerPath = path.resolve(process.cwd(), 'swagger.yaml');
    swaggerDocument = YAML.load(swaggerPath);
} catch (e) {
    console.error("No se pudo cargar swagger.yaml:", e.message);
}

// Endpoint de documentación
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

// 2. USO DE RUTAS
app.use('/api/v1/hola', holaRoutes);
app.use('/api/v1/saludo', saludoRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/login', loginRoutes);

// Ruta principal (copiada de tu versión funcional)
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

// Exportar para Vercel
module.exports = app;

// Solo escuchar si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}