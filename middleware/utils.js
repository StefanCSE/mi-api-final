// Middleware de autenticacion
// Verifica que el token JWT sea valido antes de permitir acceso

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // Obtener el token del header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      mensaje: 'Token no proporcionado',
      informacion: 'Agrega el header: Authorization: Bearer TU_TOKEN'
    });
  }
  
  // El token viene como "Bearer TOKEN", extraer solo el token
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      mensaje: 'Formato de token invalido',
      informacion: 'Usa: Authorization: Bearer TU_TOKEN'
    });
  }
  
  try {
    // Verificar el token
    const JWT_SECRET = process.env.JWT_SECRET || 'token-secreto-seguro123';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar informacion del usuario a la peticion
    req.usuario = decoded;
    
    // Continuar con la siguiente funcion
    next();
    
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token invalido o expirado',
      error: error.message
    });
  }
}

module.exports = verificarToken;
