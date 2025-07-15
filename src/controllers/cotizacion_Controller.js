// Import models
const ExcelJS = require('exceljs');
const path = require('path');
const ItemModel = require('../model/items_cotizacion_Model');
const Cotizacion = require('../model/cotizacion_Model');
const PagoModel = require('../model/pago_cotizacion_Model');
const Controller = require('./cls_wraper_Controller');

class cotizacion_Controller extends Controller {
  // Obtener cotización por código
  async getCotizacion(req, res) {
    try {
      const { codigo } = req.body;
      const cotizacion = await Cotizacion.getByCodigo(codigo);
      if (!cotizacion) {
        return res.status(400).json({ message: 'Cotización no encontrada' });
      }
      return res.status(200).json(cotizacion);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Obtener todas las cotizaciones
  async records(req, res) {
    try {
      const cotizaciones = await Cotizacion.getAll();
      return res.status(200).json(cotizaciones);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  // Crear nueva cotización
  async store(req, res) {
    try {
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total, descripcion } = req.body;

      if (!codigo || !fecha || !cliente || !tipo) {
        return res.status(400).json({ message: 'Los campos codigo, fecha, cliente y tipo son obligatorios.' });
      }

      const newCotizacion = await Cotizacion.create({
        codigo,
        fecha,
        cliente,
        tipo,
        dni,
        ruc,
        codigo_certificacion,
        estructura,
        asesor,
        celular,
        maestro,
        email,
        estado,
        total,
        descripcion // <-- NUEVO CAMPO AGREGADO
      });

      return res.status(201).json(newCotizacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Actualizar cotización por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total, descripcion } = req.body;

      if (!cliente || !tipo) {
        return res.status(400).json({ message: 'Los campos cliente y tipo son obligatorios.' });
      }

      const updatedCotizacion = await Cotizacion.update(id, {
        codigo,
        fecha,
        cliente,
        tipo,
        dni,
        ruc,
        codigo_certificacion,
        estructura,
        asesor,
        celular,
        maestro,
        email,
        estado,
        total,
        descripcion // <-- NUEVO CAMPO AGREGADO
      });

      if (!updatedCotizacion) {
        return res.status(404).json({ message: 'Cotización no encontrada.' });
      }

      return res.status(200).json(updatedCotizacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Obtener cotización por ID
  async getById(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ message: 'El ID de la cotización es requerido' });
      }
      const cotizacion = await Cotizacion.findById(_id);
      if (!cotizacion) {
        return res.status(404).json({ message: 'Cotización no encontrada' });
      }
      return res.status(200).json(cotizacion);
    } catch (error) {
      console.error('Error en getById:', error);
      return res.status(500).send(error.message);
    }
  }

  // Actualizar cotización desde modal
  async updateModal(req, res) {
    try {
      const { id } = req.params;
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total, descripcion } = req.body;

      if (!codigo || !fecha || !cliente || !tipo) {
        return res.status(400).json({
          message: 'Los campos código, fecha, cliente y tipo son obligatorios.'
        });
      }

      const updatedCotizacion = await Cotizacion.update(id, {
        codigo,
        fecha,
        cliente,
        tipo,
        dni,
        ruc,
        codigo_certificacion,
        estructura,
        asesor,
        celular,
        maestro,
        email,
        estado,
        total,
        descripcion // <-- NUEVO CAMPO AGREGADO
      });

      if (!updatedCotizacion) {
        return res.status(404).json({ message: 'Cotización no encontrada.' });
      }

      return res.status(200).json(updatedCotizacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Eliminar cotización
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedCotizacion = await Cotizacion.delete(id);
      if (!deletedCotizacion) {
        return res.status(404).json({ message: 'Cotización no encontrada.' });
      }
      return res.status(200).json({ message: 'Cotización eliminada exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  // Exportar cotizaciones a Excel (por CÓDIGO opcionalmente)
  // Exportar cotización a Excel
  async exportExcel(req, res) {
    try {
      const { codigo } = req.query;
      const cotizacion = await Cotizacion.getByCodigo(codigo);
      if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });

      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile('src/resources/formats/cotizacion.xlsm');
      const ws = wb.getWorksheet('format');
      const items = await ItemModel.getByCodigo(codigo);
      const pagos = await PagoModel.getByCodigo(codigo);
      const n_items = items.length;

      // === 1. Cabecera ===
      ws.getCell('E12').value = cotizacion.cliente;
      ws.getCell('E14').value = cotizacion.email || '';
      ws.getCell('M12').value = cotizacion.celular || '';
      ws.getCell('M13').value = cotizacion.dni || '';
      ws.getCell('E13').value = cotizacion.ruc || '';
      ws.getCell('E17').value = cotizacion.direccion || '';
      ws.getCell('E18').value = cotizacion.asesor || '';
      ws.getCell('E19').value = cotizacion.maestro || '';
      ws.getCell('M17').value = pagos[0]?.forma_pago || '';
      ws.getCell('M18').value = cotizacion.estructura || '';
      ws.getCell('M19').value = cotizacion.codigo_certificacion || '';
      ws.getCell('M5').value = cotizacion.fecha?.toISOString().split('T')[0] || '';
      ws.getCell('N5').value = cotizacion.codigo;

      // === 2. Desplazar A23:O89 ===
      for (let row = 89; row >= 23; row--) {
        for (let col = 1; col <= 15; col++) {
          const source = ws.getCell(row, col);
          const target = ws.getCell(row + n_items, col);

          target.value = source.value;
          target.font = Object.assign({}, source.font);
          target.fill = Object.assign({}, source.fill);
          target.alignment = Object.assign({}, source.alignment);
          target.border = Object.assign({}, source.border);
          target.numFmt = source.numFmt;
          source.value = null;
        }
      }

      // === 3. Insertar ítems desde C22:M22 ===
      for (let i = 0; i < n_items; i++) {
        const fila = 22 + i;
        const item = items[i];
        for (let col = 3; col <= 13; col++) {
          const base = ws.getCell(22, col);
          const dest = ws.getCell(fila, col);
          dest.font = Object.assign({}, base.font);
          dest.fill = Object.assign({}, base.fill);
          dest.alignment = Object.assign({}, base.alignment);
          dest.border = Object.assign({}, base.border);
          dest.numFmt = base.numFmt;
        }
        ws.getCell(fila, 3).value = i + 1;
        ws.getCell(fila, 4).value = item.descripcion || '';
        ws.getCell(fila, 9).value = item.metros_cubicos || 0;
        ws.getCell(fila, 10).value = 'M3';
        ws.getCell(fila, 11).value = item.total_item || 0;
        const conIGV = item.total_item ? item.total_item * 1.16 : 0;
        ws.getCell(fila, 13).value = parseFloat(conIGV.toFixed(2));
      }

      const buffer = await wb.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Cotizacion.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);
    } catch (error) {
      console.error('Error exportando Excel:', error);
      return res.status(500).send(error.message);
    }
  }

  // Renderizar vista de gestor de cotizaciones
  gestor_cotizaciones(req, res) {
    res.render('gestor_cotizaciones', {
      title: 'Gestor de Cotizaciones',
      mensaje: 'Bienvenido al Gestor de Cotizaciones',
    });
  }
}

module.exports = new cotizacion_Controller();
