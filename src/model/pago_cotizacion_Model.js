const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

// Definición del schema para pago de cotización
const pagoCotizacionSchema = new mongoose.Schema({
  codigo:       { type: String, required: false },
  monto_total:  { type: Number, required: false, default: 0 },
  monto_pago:   { type: Number, required: false, default: 0 },
  monto_saldo:  { type: Number, required: false, default: 0 },
  forma_pago:   { type: String, required: false },
  fecha_pago:   { type: Date,   required: false }
});

// 'pago_cotizacion' será el nombre de la colección en MongoDB
const mongo_pago = mongoose.model('PagoCotizacion', pagoCotizacionSchema, 'pago_cotizacion');

class pago_cotizacion_Model extends Model {
  constructor() {
    super(mongo_pago);
  }

  // Método para obtener pagos por código de cotización
  async getByCodigo(codigo) {
    return await mongo_pago.find({ codigo });
  }
}

module.exports = new pago_cotizacion_Model();
