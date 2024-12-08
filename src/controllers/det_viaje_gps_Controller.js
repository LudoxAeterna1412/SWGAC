// Import models
const DetViajeGps = require('../model/det_viaje_gps_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class det_viaje_gps_Controller extends Controller {
  // Obtener todos los registros de relación GPS-viaje
  async records(req, res) {
    try {
      const detViajeGpsRecords = await DetViajeGps.getAll(); // Obtener todos los registros de relación GPS-viaje
      return res.status(200).json(detViajeGpsRecords);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear un nuevo registro de relación GPS-viaje
  async store(req, res) {
    try {
      const { gps_id, viaje_id, det_vg_ultima_hora_registro, det_vg_ultima_latitud, det_vg_ultima_longitud, det_vg_distancia_recorrida } = req.body;

      // Validación básica
      if (!gps_id || !viaje_id || !det_vg_ultima_hora_registro || !det_vg_ultima_latitud || !det_vg_ultima_longitud) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Crear un nuevo registro de relación GPS-viaje
      const newDetViajeGps = await DetViajeGps.create({
        gps_id,
        viaje_id,
        det_vg_ultima_hora_registro,
        det_vg_ultima_latitud,
        det_vg_ultima_longitud,
        det_vg_distancia_recorrida: det_vg_distancia_recorrida || null,
      });

      return res.status(201).json(newDetViajeGps);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar un registro de relación GPS-viaje
  async update(req, res) {
    try {
      const { id } = req.params;
      const { gps_id, viaje_id, det_vg_ultima_hora_registro, det_vg_ultima_latitud, det_vg_ultima_longitud, det_vg_distancia_recorrida } = req.body;

      // Validación básica
      if (!gps_id || !viaje_id || !det_vg_ultima_hora_registro || !det_vg_ultima_latitud || !det_vg_ultima_longitud) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Actualizar el registro de relación GPS-viaje
      const updatedDetViajeGps = await DetViajeGps.update(id, {
        gps_id,
        viaje_id,
        det_vg_ultima_hora_registro,
        det_vg_ultima_latitud,
        det_vg_ultima_longitud,
        det_vg_distancia_recorrida,
      });

      if (!updatedDetViajeGps) {
        return res.status(404).json({ message: "Registro de relación GPS-viaje no encontrado." });
      }

      return res.status(200).json(updatedDetViajeGps);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar un registro de relación GPS-viaje
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Eliminar el registro de relación GPS-viaje
      const deletedDetViajeGps = await DetViajeGps.delete(id);

      if (!deletedDetViajeGps) {
        return res.status(404).json({ message: "Registro de relación GPS-viaje no encontrado." });
      }

      return res.status(200).json({ message: "Relación GPS-viaje eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar la vista del gestor de relación GPS-viaje
  gestor_det_viaje_gps(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "gestor_det_viaje_gps.html"));
  }
  simulacion(req, res) {
    res.sendFile(path.join(__dirname, "../../client", "index.html"));
  }
}

module.exports = new det_viaje_gps_Controller();
