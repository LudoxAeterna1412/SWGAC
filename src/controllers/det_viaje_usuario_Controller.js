// Import models
const DetViajeUsuario = require('../model/det_viaje_usuario_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class det_viaje_usuario_Controller extends Controller {
  // Obtener todos los registros de viaje-usuario
  async records(req, res) {
    try {
      const detViajeUsuarioRecords = await DetViajeUsuario.getAll(); // Obtener todos los registros de relación viaje-usuario
      return res.status(200).json(detViajeUsuarioRecords);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear un nuevo registro de viaje-usuario
  async store(req, res) {
    try {
      const { viaje_id, usuario_id } = req.body;

      // Validación básica
      if (!viaje_id || !usuario_id) {
        return res.status(400).json({ message: "Ambos campos (viaje_id, usuario_id) son obligatorios." });
      }

      // Crear un nuevo registro de viaje-usuario
      const newDetViajeUsuario = await DetViajeUsuario.create({
        viaje_id,
        usuario_id,
      });

      return res.status(201).json(newDetViajeUsuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar un registro de viaje-usuario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { viaje_id, usuario_id } = req.body;

      // Validación básica
      if (!viaje_id || !usuario_id) {
        return res.status(400).json({ message: "Ambos campos (viaje_id, usuario_id) son obligatorios." });
      }

      // Actualizar el registro de viaje-usuario
      const updatedDetViajeUsuario = await DetViajeUsuario.update(id, {
        viaje_id,
        usuario_id,
      });

      if (!updatedDetViajeUsuario) {
        return res.status(404).json({ message: "Registro de relación viaje-usuario no encontrado." });
      }

      return res.status(200).json(updatedDetViajeUsuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar un registro de viaje-usuario
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Eliminar el registro de viaje-usuario
      const deletedDetViajeUsuario = await DetViajeUsuario.delete(id);

      if (!deletedDetViajeUsuario) {
        return res.status(404).json({ message: "Registro de relación viaje-usuario no encontrado." });
      }

      return res.status(200).json({ message: "Relación viaje-usuario eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar la vista del gestor de viaje-usuario
  gestor_det_viaje_usuario(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "gestor_det_viaje_usuario.html"));
  }
}

module.exports = new det_viaje_usuario_Controller();
