const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const detViajeGpsSchema = new mongoose.Schema({
  gps_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gps', 
    required: true 
  },
  viaje_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Viaje', 
    required: true 
  },
  det_vg_ultima_hora_registro: { 
    type: Date, 
    required: true 
  },
  det_vg_ultima_latitud: { 
    type: Number, 
    required: true 
  },
  det_vg_ultima_longitud: { 
    type: Number, 
    required: true 
  },
  det_vg_distancia_recorrida: { 
    type: Number, 
    default: null 
  }
});

const mongo_det_viaje_gps = mongoose.model('DetViajeGps', detViajeGpsSchema, 'det_viaje_gps');

class det_viaje_gps_Model extends Model {
  constructor() {
    super(mongo_det_viaje_gps);
  }
}

module.exports = new det_viaje_gps_Model();
