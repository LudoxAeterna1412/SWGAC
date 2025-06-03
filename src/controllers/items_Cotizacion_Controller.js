// Importar modelo
const Item = require('../model/items_cotizacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");

class items_Cotizacion_Controller extends Controller {
  // Obtener ítem por código
  async getByCodigo(req, res) {
    try {
      const { codigo } = req.body;
      const item = await Item.getByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ message: "Ítem no encontrado" });
      }
      return res.status(200).json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener todos los ítems
  async records(req, res) {
    try {
      const items = await Item.getAll();
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear nuevo ítem de cotización
  async store(req, res) {
    try {
      const { codigo, codigo_diseno, descripcion, colocado, metros_cubicos, precio_unitario, total_item } = req.body;

      if (!codigo || !codigo_diseno || !descripcion || !colocado || metros_cubicos == null || precio_unitario == null || total_item == null) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const newItem = await Item.create({
        codigo,
        codigo_diseno,
        descripcion,
        colocado,
        metros_cubicos,
        precio_unitario,
        total_item
      });

      return res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar ítem por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { codigo_diseno, descripcion, colocado, metros_cubicos, precio_unitario, total_item } = req.body;

      if (!codigo_diseno || !descripcion || !colocado || metros_cubicos == null || precio_unitario == null || total_item == null) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const updatedItem = await Item.update(id, {
        codigo_diseno,
        descripcion,
        colocado,
        metros_cubicos,
        precio_unitario,
        total_item
      });

      if (!updatedItem) {
        return res.status(404).json({ message: "Ítem no encontrado." });
      }

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener ítem por ID
  async getById(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ message: "El ID es requerido" });
      }
      const item = await Item.findById(_id);
      if (!item) {
        return res.status(404).json({ message: "Ítem no encontrado" });
      }
      return res.status(200).json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }

  // Eliminar ítem por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedItem = await Item.delete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Ítem no encontrado." });
      }
      return res.status(200).json({ message: "Ítem eliminado exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Renderizar vista de gestión de ítems (si aplica)
  gestor_items(req, res) {
    res.render('gestor_items', {
      title: 'Gestor de Ítems de Cotización',
      mensaje: 'Bienvenido al gestor de ítems'
    });
  }
}

module.exports = new items_Cotizacion_Controller();
