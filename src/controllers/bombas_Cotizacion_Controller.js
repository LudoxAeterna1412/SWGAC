// Importar modelo de bombas
const Bombas = require('../model/bombas_cotizacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require('path');

class bombas_Cotizacion_Controller extends Controller {
  // Obtener bomba por código
  async getByCodigo(req, res) {
    try {
      const { codigo } = req.body;
      const bomba = await Bombas.getByCodigo(codigo);
      if (!bomba || bomba.length === 0) {
        return res.status(404).json({ message: "Bomba no encontrada" });
      }
      return res.status(200).json(bomba);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener todas las bombas
  async records(req, res) {
    try {
      const bombas = await Bombas.getAll();
      return res.status(200).json(bombas);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }

  // Crear nueva bomba de cotización
  async store(req, res) {
    try {
      const { codigo, precio_unitario, excedente, adicional, total } = req.body;

      if (!codigo || precio_unitario == null || excedente == null || adicional == null || total == null) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const newBomba = await Bombas.create({
        codigo,
        precio_unitario,
        excedente,
        adicional,
        total
      });

      return res.status(201).json(newBomba);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar bomba por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { precio_unitario, excedente, adicional, total } = req.body;

      if (precio_unitario == null || excedente == null || adicional == null || total == null) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const updatedBomba = await Bombas.update(id, {
        precio_unitario,
        excedente,
        adicional,
        total
      });

      if (!updatedBomba) {
        return res.status(404).json({ message: "Bomba no encontrada." });
      }

      return res.status(200).json(updatedBomba);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener bomba por ID
  async getById(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ message: "El ID es requerido" });
      }
      const bomba = await Bombas.findById(_id);
      if (!bomba) {
        return res.status(404).json({ message: "Bomba no encontrada" });
      }
      return res.status(200).json(bomba);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }

  // Eliminar bomba por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Bombas.delete(id);
      if (!result) {
        return res.status(404).json({ message: 'Bomba no encontrada para eliminar' });
      }
      return res.status(200).json({ message: 'Bomba eliminada' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Renderizar vista de gestión de bombas (si aplica)
  gestor_bombas(req, res) {
    res.render('gestor_bombas', {
      title: 'Gestor de Bombas de Cotización',
      mensaje: 'Bienvenido al gestor de bombas'
    });
  }
}

module.exports = new bombas_Cotizacion_Controller();
