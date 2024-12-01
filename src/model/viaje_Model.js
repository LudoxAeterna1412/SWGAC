const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const viajeSchema = new mongoose.Schema({
  ruta_origen: { type: String, required: true },
  ruta_destino: { type: String, required: true },
  ruta_duracion_estimada: { type: String, required: true }, // Formato HH:MM:SS
  viaje_hora_salida_programado: { type: Date, required: true },
  viaje_hora_llegada_programado: { type: Date, required: true },
  viaje_hora_salida_real: { type: Date },
  viaje_hora_llegada_real: { type: Date },
  viaje_duracion_real: { type: String }, // Formato HH:MM:SS
  viaje_prediccion_tiempo: { type: String }, // Formato HH:MM:SS
  viaje_estado: { type: String, required: true }
});

const mongo_viaje = mongoose.model('Viaje', viajeSchema, 'viaje');

class viaje_Model extends Model {
  constructor() {
    super(mongo_viaje);
  }
}

module.exports = new viaje_Model();
