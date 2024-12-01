//barrel file for exporting all controllers
const auth_Controller = require('./auth_Controller');
const usuario_Controller = require('./usuario_Controller');
const viaje_Controller = require('./viaje_Controller');

module.exports = { auth_Controller,
    usuario_Controller,
    viaje_Controller };