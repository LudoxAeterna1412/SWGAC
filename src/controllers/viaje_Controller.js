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

  // Crear un nuevo viaje
  async store(req, res) {
    try {
      const { ruta_origen, ruta_destino, ruta_duracion_estimada, viaje_hora_salida_programado, viaje_hora_llegada_programado, viaje_estado } = req.body;

      // Validación básica
      if (!ruta_origen || !ruta_destino || !ruta_duracion_estimada || !viaje_hora_salida_programado || !viaje_hora_llegada_programado || !viaje_estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Validación de formato de duración (HH:MM:SS)
      const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      if (!regexTime.test(ruta_duracion_estimada)) {
        return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      }

      // Crear nuevo viaje
      const newViaje = await Viaje.create({
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
      const { ruta_origen, ruta_destino, ruta_duracion_estimada, viaje_hora_salida_programado, viaje_hora_llegada_programado, viaje_estado } = req.body;

      // Validación básica
      if (!ruta_origen || !ruta_destino || !ruta_duracion_estimada || !viaje_hora_salida_programado || !viaje_hora_llegada_programado || !viaje_estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Validación de formato de duración (HH:MM:SS)
      const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      if (!regexTime.test(ruta_duracion_estimada)) {
        return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      }

      // Actualizar viaje
      const updatedViaje = await Viaje.update(id, {
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
        viaje_hora_salida_programado,
        viaje_hora_llegada_programado,
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
  // gestor_viajes(req, res) {
  //   res.sendFile(path.join(__dirname, "../resources/views", "gestor_viajes.html"));
  // }
  // Renderizar la vista del gestor de usuarios con EJS
  gestor_viajes(req, res) {
    res.render('gestor_viajes', {  // Usamos res.render para renderizar la vista EJS
      title: 'Gestor de Usuarios',
      mensaje: 'Bienvenido al Gestor de Usuarios',
    });
  }
}

module.exports = new viaje_Controller();
