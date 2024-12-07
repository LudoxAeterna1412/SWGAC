// Import models
const Viaje = require('../model/viaje_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");
class viaje_Controller extends Controller {
  // Obtener todos los viajes
  async records(req, res) {
    try {
      const viajes = await Viaje.getAll(); // Obtener todos los viajes
      return res.status(200).json(viajes);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  async getViajeById(req, res) {
    try {
      const { _id } = req.body; // Asegúrate de recibir el ID del cuerpo de la solicitud

      if (!_id) {
        return res.status(400).json({ message: "El ID del viaje es requerido" });
      }

      const viaje = await Viaje.findById(_id); // Buscar el viaje por ID
      if (!viaje) {
        return res.status(404).json({ message: "Viaje no encontrado" });
      }

      return res.status(200).json(viaje); // Retornar los datos del viaje
    } catch (error) {
      console.error("Error en getViajeById:", error);
      return res.status(500).send(error.message); // Manejar errores del servidor
    }
  }

  // Crear un nuevo viaje
  async store(req, res) {
    try {
      const {
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
        viaje_hora_salida_programado,
        viaje_hora_llegada_programado,
        viaje_estado } = req.body;
      // Validación básica
      if (
        !ruta_origen ||
        !ruta_destino ||
        !ruta_duracion_estimada ||
        !viaje_hora_salida_programado ||
        !viaje_hora_llegada_programado ||
        !viaje_estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
      // Validación de formato de duración (HH:MM:SS)
      const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      if (!regexTime.test(ruta_duracion_estimada)) {
        return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      }
      // Generar un código único para el viaje
      const viaje_codigo = `${ruta_origen.slice(0, 3).toUpperCase()}-${ruta_destino.slice(0, 3).toUpperCase()}-${Date.now()}`;
      // Crear nuevo viaje
      const newViaje = await Viaje.create({
        viaje_codigo,
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
        viaje_hora_salida_programado,
        viaje_hora_llegada_programado,
        viaje_estado,
      });
      return res.status(201).json(newViaje);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Actualizar un viaje
  async update(req, res) {
    try {
      const { id } = req.params;
      const { viaje_codigo,
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
        viaje_hora_salida_programado,
        viaje_hora_llegada_programado,
        viaje_hora_salida_real,
        viaje_hora_llegada_real,
        viaje_duracion_real,
        viaje_prediccion_tiempo,
        viaje_estado } = req.body;
      // Validación básica
      //if (!viaje_codigo ||
      //  !ruta_origen ||
      //  !ruta_destino ||
      //  !ruta_duracion_estimada ||
      //  !viaje_hora_salida_programado ||
      //  !viaje_hora_llegada_programado ||
      //  !viaje_estado) {
      //  return res.status(400).json({ message: "Todos los campos son obligatorios." });
      //}
      // Validación de formato de duración (HH:MM:SS)
      //const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      //if (!regexTime.test(ruta_duracion_estimada)) {
      //  return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      //}
      // Actualizar viaje
      const updatedViaje = await Viaje.update(id, {
        viaje_codigo,
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
        viaje_hora_salida_programado,
        viaje_hora_llegada_programado,
        viaje_hora_salida_real,
        viaje_hora_llegada_real,
        viaje_duracion_real,
        viaje_prediccion_tiempo,
        viaje_estado,
      });
      if (!updatedViaje) {
        return res.status(404).json({ message: "Viaje no encontrado." });
      }
      return res.status(200).json(updatedViaje);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Eliminar un viaje
  async delete(req, res) {
    try {
      const { id } = req.params;
      // Eliminar viaje
      const deletedViaje = await Viaje.delete(id);
      if (!deletedViaje) {
        return res.status(404).json({ message: "Viaje no encontrado." });
      }
      return res.status(200).json({ message: "Viaje eliminado exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Renderizar la vista del gestor de viajes
  gestor_viajes(req, res) {
    res.render('gestor_viajes', {
      title: 'Gestor de Viajes',
      mensaje: 'Bienvenido al Gestor de Viajes',
    });
  }
}
module.exports = new viaje_Controller();
