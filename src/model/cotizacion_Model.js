const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

// Definición del schema para Cotización (sin items)
const cotizacionSchema = new mongoose.Schema({
  codigo:   { type: String, required: true, unique: true },
  fecha:    { type: Date,   required: true },
  cliente:  { type: String, required: true },
  tipo:     { type: String, required: true },
  dni:      { type: String, required: false },
  ruc:      { type: String, required: false },
  total:    { type: Number, required: true, default: 0 }
});

// Tercer parámetro 'cotizacion' será el nombre de la colección en MongoDB
const mongo_cotizacion = mongoose.model('Cotizacion', cotizacionSchema, 'cotizacion');

class cotizacion_Model extends Model {
  constructor() {
    super(mongo_cotizacion);
  }

  // Método para obtener una cotización por código
  async getByCodigo(codigo) {
    return await mongo_cotizacion.findOne({ codigo: codigo });
  }
}

module.exports = new cotizacion_Model();
