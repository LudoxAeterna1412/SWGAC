const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

// Definición del schema para un ítem de cotización de bombas
const bombasCotizacionSchema = new mongoose.Schema({
  precio_unitario: { type: Number, required: false, default: 0 },
  excedente:        { type: Number, required: false, default: 0 },
  adicional:        { type: Number, required: false, default: 0 },
  total:            { type: Number, required: false, default: 0 },
  codigo:           { type: String, required: false }
});

// 'bombas_cotizacion' será el nombre de la colección en MongoDB
const mongo_bombas = mongoose.model('BombasCotizacion', bombasCotizacionSchema, 'bombas_cotizacion');

class bombas_cotizacion_Model extends Model {
  constructor() {
    super(mongo_bombas);
  }

  // Método para obtener una bomba de cotización por código
  async getByCodigo(codigo) {
    return await mongo_bombas.find({ codigo: codigo });
  }
}

module.exports = new bombas_cotizacion_Model();
