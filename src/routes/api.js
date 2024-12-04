//get instance of app from express
const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Importamos crypto
const { auth_Controller,
    usuario_Controller,
    viaje_Controller,
    gps_Controller,
    ruta_Controller,
    notificacion_Controller,
    det_viaje_gps_Controller,
    det_viaje_usuario_Controller   } = require('../controllers/barrel_Controller');

//declara los Routes para utilizar prefijos
const userRoutes = express.Router();
const authRoutes = express.Router();
const viajeRoutes = express.Router();

authRoutes.post('/login', auth_Controller.login);

userRoutes.post('/getUser', usuario_Controller.getUser);
userRoutes.get('/records', usuario_Controller.records);
userRoutes.post('/store', usuario_Controller.store);
userRoutes.delete('/delete/:id', usuario_Controller.delete);
userRoutes.post('/getUserById', usuario_Controller.getUserById);
userRoutes.put('/update/:id', usuario_Controller.update);
userRoutes.put('/updateModal/:id', usuario_Controller.updateModal);

viajeRoutes.get('/records', viaje_Controller.records);
viajeRoutes.post('/getViajeById', viaje_Controller.getViajeById);
viajeRoutes.post('/store', viaje_Controller.store);
viajeRoutes.delete('/delete/:id', viaje_Controller.delete);
viajeRoutes.put('/update/:id', viaje_Controller.update);

//forma de poner prefijos a las rutas
router.use('/auth', authRoutes); // prefijo auth
router.use('/usuario', userRoutes); // prefijo users
router.use('/viaje', viajeRoutes); // prefijo users
module.exports = router;