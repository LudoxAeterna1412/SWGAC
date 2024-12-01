//get instance of app from express
const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Importamos crypto

const { auth_Controller, usuario_Controller } = require('../controllers/barrel_Controller');

// router.use('/auth/login', authController.login);
// router.use('/users', userController.records)

//declara los Routes para utilizar prefijos
const userRoutes = express.Router();
const authRoutes = express.Router();

//rutas
//login
authRoutes.post('/login', auth_Controller.login);
//logout
userRoutes.post('/getUser', usuario_Controller.getUser);
//users
userRoutes.get('/records', usuario_Controller.records);

// userRoutes.get('/getByTipo', usuario_Controller.getByTipo);

userRoutes.post('/store', usuario_Controller.store);

// Nueva ruta para eliminar un usuario
userRoutes.delete('/delete/:id', usuario_Controller.delete);

// Nueva ruta para actualizar un usuario
userRoutes.put('/update/:id', usuario_Controller.update);


//forma de poner prefijos a las rutas
router.use('/auth', authRoutes); // prefijo auth
router.use('/usuario', userRoutes); // prefijo users


module.exports = router;