const mongoose = require('mongoose');
const Model = require('./cls_wraper_Model');

const userSchema = new mongoose.Schema({
  usuario_nombre: { type: String, required: true },
  usuario_email: { type: String, required: true, unique: true },
  usuario_password: { type: String, required: true },
  usuario_tipo: { type: String, required: true },
  usuario_sesion: { type: String  },
  usuario_ultimasesion: { type: Date  },
});

const mongo_usuario = mongoose.model('Usuario', userSchema, 'usuario');

class usuario_Model extends Model {

  constructor() {
    super(mongo_usuario);
  }
  async getByEmail(email) {
    return await mongo_usuario.findOne({ usuario_email: email });
  }
}
module.exports = new usuario_Model();

