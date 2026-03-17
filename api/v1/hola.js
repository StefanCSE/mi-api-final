// Endpoint con respuesta json 
export default function handler(req, res) {
  const mensaje = process.env.MENSAJE_BIENVENIDA || 'Bienvenido a mi api final!';
  
  // Responder con codigo 200 en forma json
  res.status(200).json({
    mensaje: mensaje
  });
}
