//import { express } from 'express'; // const express = require('express');
//import { cors } from 'cors'; // const cors = require('cors');
//import { connectDB } from '../config/db'; // const connectDB = require('./config/db');
//import { dotenv } from 'dotenv'; // const dotenv = require('dotenv');
//import { ejsLocals } from 'ejs-locals'; // const ejsLocals = require('ejs-locals');
//import { logger } from 'morgan'; // const logger = require('morgan');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const ejsLocals = require('ejs-locals');
const http = require('http');
const logger = require('morgan');
const { Server } = require('socket.io');
// import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
const app = express();
const session = require('express-session');  // Importar express-session

// connectDB();
const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar mensajes del cliente
  socket.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    
    // Enviar mensaje a todos los clientes, incluido el que envió el mensaje
    io.emit('message', message);
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// app.use(express.static('client'));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.engine('ejs', ejsLocals);
app.set('view engine', 'ejs');
app.set('views', './src/resources/views');
app.use(express.static('./src/resources/views'));

const apiRoutes = require('./src/routes/api'); // Pasamos crypto como parámetro
const webRoutes = require('./src/routes/web');


app.use(logger('dev'));
app.use('/api', apiRoutes);
app.use('/', webRoutes);
// app.use(logger('dev'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message, archivo: err.stack });
});

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
