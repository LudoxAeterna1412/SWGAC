const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');
const notificacionSchema = new mongoose.Schema({
  notificacion_mensaje: { type: String, required: true },
  notificacion_hora_programado: { type: Date, required: true },
  det_vu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'viaje', required: true }
  // det_vu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DetalleViajeUsuario', required: true }
});
const mongo_notificacion = mongoose.model('Notificacion', notificacionSchema, 'notificacion');
class notificacion_Model extends Model {
  constructor() {
    super(mongo_notificacion);
  }
}
module.exports = new notificacion_Model();
