// Import models
const Notificacion = require('../model/notificacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class notificacion_Controller extends Controller {
  // Obtener todas las notificaciones
  async records(req, res) {
    try {
      const notificaciones = await Notificacion.getAll(); // Obtener todas las notificaciones
      return res.status(200).json(notificaciones);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear una nueva notificación
  async store(req, res) {
    try {
      const { notificacion_mensaje, notificacion_hora_programado, det_vu_id } = req.body;

      // Validación básica
      if (!notificacion_mensaje || !notificacion_hora_programado || !det_vu_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Crear nueva notificación
      const newNotificacion = await Notificacion.create({
        notificacion_mensaje,
        notificacion_hora_programado,
        det_vu_id,
      });

      return res.status(201).json(newNotificacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar una notificación
  async update(req, res) {
    try {
      const { id } = req.params;
      const { notificacion_mensaje, notificacion_hora_programado, det_vu_id } = req.body;

      // Validación básica
      if (!notificacion_mensaje || !notificacion_hora_programado || !det_vu_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Actualizar notificación
      const updatedNotificacion = await Notificacion.update(id, {
        notificacion_mensaje,
        notificacion_hora_programado,
        det_vu_id,
      });

      if (!updatedNotificacion) {
        return res.status(404).json({ message: "Notificación no encontrada." });
      }

      return res.status(200).json(updatedNotificacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar una notificación
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Eliminar notificación
      const deletedNotificacion = await Notificacion.delete(id);

      if (!deletedNotificacion) {
        return res.status(404).json({ message: "Notificación no encontrada." });
      }

      return res.status(200).json({ message: "Notificación eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar la vista del gestor de notificaciones
  gestor_notificaciones(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "gestor_notificaciones.html"));
  }
}

module.exports = new notificacion_Controller();
