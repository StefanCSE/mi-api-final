// Endpoint para obtener todos los usuarios de MongoDB
// Este endpoint se conecta a la base de datos y devuelve la lista de usuarios

const conectarDB = require('../../lib/db');
const Usuario = require('../../models/Usuario');

export default async function handler(req, res) {
  try {
    // Conectar a MongoDB
    await conectarDB();
    
    // Obtener todos los usuarios
    const usuarios = await Usuario.find({});
    
    // Responder con la lista de usuarios
    res.status(200).json({
      exitoso: true,
      cantidad: usuarios.length,
      usuarios: usuarios
    });
    
  } catch (error) {
    // Si hay error, responder con mensaje de error
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
}
