// Importar modelo de pagos de cotización
const Pagos = require('../model/pago_cotizacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require('path');

class pagos_Cotizacion_Controller extends Controller {
  // Obtener pagos por código de cotización
  async getByCodigo(req, res) {
    try {
      const { codigo } = req.body;
      const pagos = await Pagos.getByCodigo(codigo);
      if (!pagos || pagos.length === 0) {
        return res.status(404).json({ message: "Pagos no encontrados" });
      }
      return res.status(200).json(pagos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener todos los pagos
  async records(req, res) {
    try {
      const pagos = await Pagos.getAll();
      return res.status(200).json(pagos);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }

  // Crear nuevo pago de cotización
  async store(req, res) {
    try {
      const { codigo, monto_total, monto_pago, forma_pago, fecha_pago } = req.body;

      if (!codigo || monto_total == null || monto_pago == null || !forma_pago || !fecha_pago) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const newPago = await Pagos.create({
        codigo,
        monto_total,
        monto_pago,
        forma_pago,
        fecha_pago
      });

      return res.status(201).json(newPago);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Actualizar pago por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { monto_total, monto_pago, forma_pago, fecha_pago } = req.body;

      if (monto_total == null || monto_pago == null || !forma_pago || !fecha_pago) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      const updatedPago = await Pagos.update(id, {
        monto_total,
        monto_pago,
        forma_pago,
        fecha_pago
      });

      if (!updatedPago) {
        return res.status(404).json({ message: "Pago no encontrado." });
      }

      return res.status(200).json(updatedPago);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener pago por ID
  async getById(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ message: "El ID es requerido" });
      }
      const pago = await Pagos.findById(_id);
      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }
      return res.status(200).json(pago);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }

  // Eliminar pago por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Pagos.delete(id);
      if (!result) {
        return res.status(404).json({ message: 'Pago no encontrado para eliminar' });
      }
      return res.status(200).json({ message: 'Pago eliminado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Renderizar vista de gestión de pagos (si aplica)
  gestor_pagos(req, res) {
    res.render('gestor_pagos', {
      title: 'Gestor de Pagos de Cotización',
      mensaje: 'Bienvenido al gestor de pagos'
    });
  }
}

module.exports = new pagos_Cotizacion_Controller();