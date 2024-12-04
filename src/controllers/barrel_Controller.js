//barrel file for exporting all controllers
const auth_Controller = require('./auth_Controller');
const usuario_Controller = require('./usuario_Controller');
const viaje_Controller = require('./viaje_Controller');
const gps_Controller = require('./gps_Controller');
const ruta_Controller = require('./ruta_Controller');
const notificacion_Controller = require('./notificacion_Controller');
const det_viaje_gps_Controller = require('./det_viaje_gps_Controller');
const det_viaje_usuario_Controller = require('./det_viaje_usuario_Controller');

module.exports = { auth_Controller,
    usuario_Controller,
    viaje_Controller,
    gps_Controller,
    ruta_Controller,
    notificacion_Controller,
    det_viaje_gps_Controller,
    det_viaje_usuario_Controller  };