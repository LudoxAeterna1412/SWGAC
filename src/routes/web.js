//get instance of app from express
const express = require('express');
const router = express.Router();

const { auth_Controller,
    usuario_Controller,
    notificacion_Controller,
    cotizacion_Controller,
    items_Cotizacion_Controller} = require('../controllers/barrel_Controller');


router.use('/gestor_cotizaciones', cotizacion_Controller.gestor_cotizaciones);





router.use('/login', auth_Controller.index);
router.use('/dashboard', auth_Controller.dashboard);
router.use('/registrar_usuario', auth_Controller.registrar_usuario);
router.use('/gestor_usuarios', usuario_Controller.gestor_usuarios);
router.use('/gestor_notificaciones', notificacion_Controller.gestor_notificaciones);



module.exports = router;
