//get instance of app from express
const express = require('express');
const router = express.Router();

const { auth_Controller,
    usuario_Controller,
    viaje_Controller,
    gps_Controller,
    ruta_Controller,
    notificacion_Controller,
    det_viaje_gps_Controller,
    det_viaje_usuario_Controller} = require('../controllers/barrel_Controller');


router.use('/login', auth_Controller.index);
router.use('/dashboard', auth_Controller.dashboard);
router.use('/registrar_usuario', auth_Controller.registrar_usuario);
router.use('/gestor_usuarios', usuario_Controller.gestor_usuarios);
router.use('/gestor_viajes', viaje_Controller.gestor_viajes);
router.use('/gestor_gps', gps_Controller.gestor_gps);
router.use('/gestor_rutas', ruta_Controller.gestor_rutas);
router.use('/gestor_notificaciones', notificacion_Controller.gestor_notificaciones);

// Ruta raíz
app.get('/simulacion', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});


module.exports = router;
