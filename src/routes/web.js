//get instance of app from express
const express = require('express');
const router = express.Router();

const { auth_Controller,
    usuario_Controller,
    viaje_Controller} = require('../controllers/barrel_Controller');


router.use('/login', auth_Controller.index);
router.use('/dashboard', auth_Controller.dashboard);
router.use('/gestor_usuarios', usuario_Controller.gestor_usuarios);
router.use('/gestor_viajes', viaje_Controller.gestor_viajes);



module.exports = router;
