// Endpoint que recibe el parametro 'nombre' y responde con saludo personalizado
// Incluye manejo de errores
export default function handler(req, res) {
  const { nombre } = req.query;
  if (!nombre) {
    // Si no hay nombre, devolver error 400
    return res.status(400).json({
      error: 'El parametro nombre es requerido',
      ejemplo: '/api/v1/saludo?nombre=Aida'
    });
  }
  
  // Si hay nombre, responder con saludo personalizado
  res.status(200).json({
    mensaje: `Hola, ${nombre}!`
  });
}
