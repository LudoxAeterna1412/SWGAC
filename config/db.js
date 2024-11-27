const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno

const connectDB = async () => {
    try {
        const client = await mongoose.connect(process.env.MONGO_URI,);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1);
    }
};

module.exports = connectDB;
