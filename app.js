const express = require('express');
const cors = require('cors');  // Importamos cors
const connectDB = require('./config/db');
// const path = require('path');
const dotenv = require('dotenv');

dotenv.config();  // Cargar variables de entorno

const app = express();// Crear una instancia de Express
// app.use('/api', apiRoutes);

connectDB();// Conectar a la base de datos


const corsOptions = {
    origin: 'http://localhost:3000',  // Permitir solo el origen de tu frontend
    methods: ['GET', 'POST'],         // Especificar qué métodos HTTP permitir
    allowedHeaders: ['Content-Type'], // Especificar los encabezados permitidos
};
app.use(cors(corsOptions));  // Usamos la configuración personalizada
app.use(express.urlencoded({ extended: true }));
app.use(express.json());// Middleware para manejar JSON y datos URL encoded
app.use(express.static('./src/resources/views')); //templates

// Rutas de la API
const apiRoutes = require('./src/routes/api');
const webRoutes = require('./src/routes/web');
app.use('/api', apiRoutes);
app.use('/', webRoutes);


// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack); 

  res.status(500).json({ error: err.message, archivo: err.stack,  });
});

// Iniciar el servidor (para desarrollo local)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;