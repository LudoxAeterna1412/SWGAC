const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

// Definición del schema para un ítem de cotización individual
const itemCotizacionSchema = new mongoose.Schema({
  codigo:           { type: String, required: true, unique: true },
  codigo_diseno:    { type: String, required: true },
  descripcion:      { type: String, required: true },
  colocado:         { type: String, required: true },
  metros_cubicos:   { type: Number, required: true, default: 0 },
  precio_unitario:  { type: Number, required: true, default: 0 },
  total_item:       { type: Number, required: true, default: 0 }
});

// 'items_cotizacion' será el nombre de la colección en MongoDB
const mongo_item = mongoose.model('ItemCotizacion', itemCotizacionSchema, 'items_cotizacion');

class items_cotizacion_Model extends Model {
  constructor() {
    super(mongo_item);
  }

  // Método para obtener un ítem de cotización por código
  async getByCodigo(codigo) {
    return await mongo_item.find({ codigo: codigo });
  }
}

module.exports = new items_cotizacion_Model();
