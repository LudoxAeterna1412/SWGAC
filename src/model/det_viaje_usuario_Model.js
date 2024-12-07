const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const detViajeUsuarioSchema = new mongoose.Schema({

  viaje_id: {
    type: String,
    required: true
  },
  usuario_email: {
    type: String,
    required: true
  }
});

const mongo_det_viaje_usuario = mongoose.model('DetViajeUsuario', detViajeUsuarioSchema, 'det_viaje_usuario');

class det_viaje_usuario_Model extends Model {
  constructor() {
    super(mongo_det_viaje_usuario);
  }

  async getByUsuario(usuario) {
    return await mongo_det_viaje_usuario.find({ usuario_id: usuario });
  }
  async getByViaje(viaje) {
    return await mongo_det_viaje_usuario.find({ viaje_id: viaje });
  }
}

module.exports = new det_viaje_usuario_Model();
