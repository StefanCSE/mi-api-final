// Endpoint protegido que requiere autenticacion JWT
// Solo usuarios con token valido pueden acceder
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Token no proporcionado',
        informacion: 'Primero haz login en /api/v1/login para obtener un token'
      });
    }
    
    // Extraer el token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        mensaje: 'Formato de token invalido'
      });
    }
    
    // Verificar el token
    const JWT_SECRET = process.env.JWT_SECRET || 'token-secreto-seguro123';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Si el token es valido, responder con datos protegidos
    res.status(200).json({
      mensaje: 'Acceso permitido a contenido protegido',
      usuario: decoded.usuario,
      datosProtegidos: {
        usuarios: [
          { id: 1, nombre: 'Usuario 1', email: 'user1@example.com' },
          { id: 2, nombre: 'Usuario 2', email: 'user2@example.com' },
          { id: 3, nombre: 'User3', email: 'user3@example.com' }
        ]
      }
    });
    
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token invalido o expirado',
      error: error.message
    });
  }
}
