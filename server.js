const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conectar a mongodb
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Error de MongoDB:', err));

// Cargar swagger
const swaggerPath = path.join(process.cwd(), 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
