// Modelo de datos para Usuario
// Define la estructura de un usuario en la base de datos

const mongoose = require('mongoose');

// Definir el esquema del usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  edad: {
    type: Number,
    required: false
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// Exportar o usar modelo ya existente
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
