// Import models
const GPS = require('../model/gps_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class gps_Controller extends Controller {
  // Obtener todos los registros de GPS
  async records(req, res) {
    try {
      const gpsRecords = await GPS.getAll(); // Obtener todos los registros de GPS
      return res.status(200).json(gpsRecords);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear un nuevo registro de GPS
  async store(req, res) {
    try {
      const { gps_latitud, gps_longitud, gps_estado } = req.body;

      // Validación básica
      if (gps_latitud === undefined || gps_longitud === undefined || !gps_estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Crear un nuevo registro de GPS
      const newGPS = await GPS.create({
        gps_latitud,
        gps_longitud,
        gps_estado,
      });

      return res.status(201).json(newGPS);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar un registro de GPS
  async update(req, res) {
    try {
      const { id } = req.params;
      const { gps_latitud, gps_longitud, gps_estado } = req.body;

      // Validación básica
      if (gps_latitud === undefined || gps_longitud === undefined || !gps_estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Actualizar el registro de GPS
      const updatedGPS = await GPS.update(id, {
        gps_latitud,
        gps_longitud,
        gps_estado,
      });

      if (!updatedGPS) {
        return res.status(404).json({ message: "Registro de GPS no encontrado." });
      }

      return res.status(200).json(updatedGPS);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar un registro de GPS
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Eliminar el registro de GPS
      const deletedGPS = await GPS.delete(id);

      if (!deletedGPS) {
        return res.status(404).json({ message: "Registro de GPS no encontrado." });
      }

      return res.status(200).json({ message: "Registro de GPS eliminado exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar la vista del gestor de GPS
  gestor_gps(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "gestor_gps.html"));
  }
}

module.exports = new gps_Controller();
