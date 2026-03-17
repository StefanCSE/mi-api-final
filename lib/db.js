const mongoose = require('mongoose');
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function conectarDB() {
  // Si ya hay una conexion, usarla
  if (cached.conn) {
    return cached.conn;
  }

  // Y si no la hay crearla
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Obtener URI de MongoDB desde variables de entorno
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Define la variable MONGODB_URI en tu archivo .env');
    }

    // Crear la conexion
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = conectarDB;
