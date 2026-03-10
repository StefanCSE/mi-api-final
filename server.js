const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conectar a mongodb
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conexion exitosa'))
  .catch(err => console.log('Error de MongoDB:', err));

let swaggerDocument;
try {
    const swaggerPath = path.resolve(process.cwd(), 'swagger.yaml');
    swaggerDocument = YAML.load(swaggerPath);
} catch (e) {
    console.error("No se pudo cargar swagger.yaml:", e.message);
}

app.get('/api-docs', (req, res) => {
  if (!swaggerDocument) {
    return res.status(500).send("Error: No se pudo cargar el archivo swagger.yaml");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Mi API Aventura</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" charset="UTF-8"></script>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDocument)},
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout",
          });
        };
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

// Rutas
app.use('/api/v1/hola', require('./api/v1/hola'));
app.use('/api/v1/saludo', require('./api/v1/saludo'));
app.use('/api/v1/usuarios', require('./api/v1/usuarios'));
app.use('/api/v1/login', require('./api/v1/login'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
