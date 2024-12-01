const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const rutaSchema = new mongoose.Schema({
  ruta_origen: { type: String, required: true },
  ruta_destino: { type: String, required: true },
  ruta_duracion_estimada: { type: String, required: true }, // Mantener duración como string para formato HH:MM:SS
});

const mongo_ruta = mongoose.model('Ruta', rutaSchema, 'ruta');

class ruta_Model extends Model {
  constructor() {
    super(mongo_ruta);
  }
}

module.exports = new ruta_Model();
