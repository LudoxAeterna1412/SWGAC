const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

// Definición del schema para Cotización (sin items)
const cotizacionSchema = new mongoose.Schema({
  
// DATOS DEL CLIENTE  
  cliente:              { type: String, required: false },
  email:                { type: String, required: false },
  celular:              { type: String, required: false },
  dni:                  { type: String, required: false },
  ruc:                  { type: String, required: false },

  tipo:                 { type: String, required: false },
// DATOS DEL PROYECTO  
  fecha:                { type: Date,   required: false },
  codigo:               { type: String, required: true, unique: true },

  direccion:            { type: String, required: false },
  asesor:               { type: String, required: false },
  maestro:              { type: String, required: false },
  // tipo de pago (pago_cotizacion_Model)
  estructura:           { type: String, required: false },
  codigo_certificacion: { type: String, required: false },

  total:                { type: Number, required: false, default: 0 },
  estado:               { type: String, required: false }
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
