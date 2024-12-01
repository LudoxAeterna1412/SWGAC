const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const gpsSchema = new mongoose.Schema({
  gps_latitud: { type: Number, required: true }, // Usamos tipo Number para latitud
  gps_longitud: { type: Number, required: true }, // Usamos tipo Number para longitud
  gps_estado: { type: String, required: true },   // Representa el estado del GPS (e.g., "activo")
});

const mongo_gps = mongoose.model('GPS', gpsSchema, 'gps');

class gps_Model extends Model {
  constructor() {
    super(mongo_gps);
  }
}

module.exports = new gps_Model();
