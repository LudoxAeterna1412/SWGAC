const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const detViajeUsuarioSchema = new mongoose.Schema({
  viaje_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Viaje', 
    required: true 
  },
  usuario_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  }
});

const mongo_det_viaje_usuario = mongoose.model('DetViajeUsuario', detViajeUsuarioSchema, 'det_viaje_usuario');

class det_viaje_usuario_Model extends Model {
  constructor() {
    super(mongo_det_viaje_usuario);
  }
}

module.exports = new det_viaje_usuario_Model();
