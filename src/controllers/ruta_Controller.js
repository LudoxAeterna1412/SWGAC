// Import models
const Ruta = require('../model/ruta_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class ruta_Controller extends Controller {
  // Obtener todas las rutas
  async records(req, res) {
    try {
      const rutas = await Ruta.getAll(); // Obtener todas las rutas
      return res.status(200).json(rutas);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear una nueva ruta
  async store(req, res) {
    try {
      const { ruta_origen, ruta_destino, ruta_duracion_estimada } = req.body;

      // Validación básica
      if (!ruta_origen || !ruta_destino || !ruta_duracion_estimada) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Validación de formato de duración (HH:MM:SS)
      const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      if (!regexTime.test(ruta_duracion_estimada)) {
        return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      }

      // Crear nueva ruta
      const newRuta = await Ruta.create({
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
      });

      return res.status(201).json(newRuta);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar una ruta
  async update(req, res) {
    try {
      const { id } = req.params;
      const { ruta_origen, ruta_destino, ruta_duracion_estimada } = req.body;

      // Validación básica
      if (!ruta_origen || !ruta_destino || !ruta_duracion_estimada) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Validación de formato de duración (HH:MM:SS)
      const regexTime = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      if (!regexTime.test(ruta_duracion_estimada)) {
        return res.status(400).json({ message: "La duración estimada no tiene el formato correcto (HH:MM:SS)." });
      }

      // Actualizar ruta
      const updatedRuta = await Ruta.update(id, {
        ruta_origen,
        ruta_destino,
        ruta_duracion_estimada,
      });

      if (!updatedRuta) {
        return res.status(404).json({ message: "Ruta no encontrada." });
      }

      return res.status(200).json(updatedRuta);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar una ruta
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Eliminar ruta
      const deletedRuta = await Ruta.delete(id);

      if (!deletedRuta) {
        return res.status(404).json({ message: "Ruta no encontrada." });
      }

      return res.status(200).json({ message: "Ruta eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar la vista del gestor de rutas
  //gestor_rutas(req, res) {
  //  res.sendFile(path.join(__dirname, "../resources/views", "gestor_rutas.html"));
  //}

  gestor_rutas(req, res) {
    res.render('gestor_rutas', {  // Usamos res.render para renderizar la vista EJS
    });
  }
}

module.exports = new ruta_Controller();
