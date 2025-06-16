//barrel file for exporting all controllers
const auth_Controller = require('./auth_Controller');
const usuario_Controller = require('./usuario_Controller');
const notificacion_Controller = require('./notificacion_Controller');
const cotizacion_Controller = require('./cotizacion_Controller');
const bombas_Cotizacion_Controller = require('./bombas_Cotizacion_Controller');

const items_Cotizacion_Controller = require('./items_Cotizacion_Controller');

const pagos_Cotizacion_Controller = require('./pagos_Cotizacion_Controller');
module.exports = {
    auth_Controller,
    usuario_Controller,

    notificacion_Controller,

    cotizacion_Controller,

    items_Cotizacion_Controller,

    bombas_Cotizacion_Controller,
    pagos_Cotizacion_Controller
};





