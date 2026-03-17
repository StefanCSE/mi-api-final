// Entpoint para login y generacion de token JWT
// Recibe usuario y contraseña y devuelve un token JWT si las credenciales son correctas
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default async function handler(req, res) {
  // Solo permitir metodo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Metodo no permitido' });
  }

  try {
    const { usuario, contrasena } = req.body;
    
    // Verificar que se enviaron los datos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        mensaje: 'Usuario y contraseña son requeridos'
      });
    }

    // Ejemplo con credenciales hardcodeadas
    const usuarioValido = 'admin';
    const contrasenaValida = '1234';
    
    // Verificar credenciales
    if (usuario !== usuarioValido || contrasena !== contrasenaValida) {
      return res.status(401).json({
        mensaje: 'Credenciales invalidas'
      });
    }
    
    // Obtenemos el JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'token-secreto-seguro123';
    
    // Crear el token JWT
    const token = jwt.sign(
      { 
        usuario: usuario,
        rol: 'usuario'
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Para que expire en 24 horas
    );
    
    // Responder con el token
    res.status(200).json({
      exitoso: true,
      mensaje: 'Login exitoso',
      token: token,
      usuario: usuario
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
}
