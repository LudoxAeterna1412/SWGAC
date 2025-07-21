// Import models
const ExcelJS = require('exceljs');
const path = require('path');
const ItemModel = require('../model/items_cotizacion_Model');
const Cotizacion = require('../model/cotizacion_Model');
const PagoModel = require('../model/pago_cotizacion_Model');
const axios = require('axios');
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

      const pagos = await PagoModel.getByCodigo(codigo);
      const items = await ItemModel.getByCodigo(codigo);
      const n_items = items.length;

      // === 1. Insertar datos fijos ===
      const campos = [
        { celda: 'D8', valor: cotizacion.cliente },
        { celda: 'D10', valor: cotizacion.email || '' },
        { celda: 'L8', valor: cotizacion.celular || '' },
        { celda: 'L9', valor: cotizacion.dni || '' },
        { celda: 'L10', valor: cotizacion.ruc || '' },
        { celda: 'D12', valor: cotizacion.direccion || '' },
        { celda: 'D13', valor: cotizacion.asesor || '' },
        { celda: 'D14', valor: cotizacion.maestro || '' },
        { celda: 'L12', valor: pagos[0]?.forma_pago || '' },
        { celda: 'L13', valor: cotizacion.estructura || '' },
        { celda: 'L14', valor: cotizacion.codigo_certificacion || '' },
        { celda: 'L4', valor: cotizacion.fecha?.toISOString().split('T')[0] || '' },
        { celda: 'M4', valor: cotizacion.codigo },
      ];

      for (const campo of campos) {
        ws.getCell(campo.celda).value = campo.valor;
      }

      // === 2. Insertar ítems a partir de B16:L16 replicando su estilo ===
      const filaBase = 16;
      const plantilla = {};

      for (let col = 2; col <= 12; col++) {
        const cell = ws.getCell(filaBase, col);
        plantilla[col] = {
          font: { ...cell.font, color: { argb: 'FF000000' } },
          fill: cell.fill,
          alignment: cell.alignment,
          border: cell.border,
          numFmt: cell.numFmt
        };
      }

      for (let i = 1; i < n_items; i++) {
        ws.insertRow(filaBase + i, []);
      }

      let totalSinIGV = 0;
      let totalConIGV = 0;

      for (let i = 0; i < n_items; i++) {
        const fila = filaBase + i;
        const item = items[i];
        const total = item.total_item || 0;
        const conIGV = total * 1.16;

        totalSinIGV += total;
        totalConIGV += conIGV;

        for (let col = 2; col <= 12; col++) {
          const dest = ws.getCell(fila, col);
          const estilo = plantilla[col];
          if (estilo.font) dest.font = estilo.font;
          if (estilo.fill) dest.fill = estilo.fill;
          if (estilo.alignment) dest.alignment = estilo.alignment;
          if (estilo.border) dest.border = estilo.border;
          if (estilo.numFmt) dest.numFmt = estilo.numFmt;
        }

        ws.getCell(fila, 2).value = i + 1;
        ws.getCell(fila, 3).value = item.descripcion || '';
        ws.getCell(fila, 8).value = item.metros_cubicos || 0;
        ws.getCell(fila, 9).value = 'M3';
        ws.getCell(fila, 10).value = total;
        ws.getCell(fila, 12).value = parseFloat(conIGV.toFixed(2));
      }

      // === 3. Insertar totales en la fila siguiente sin aplicar estilos ===
      const filaTotal = filaBase + n_items;
      ws.getCell(filaTotal, 10).value = `Total = ${totalSinIGV.toFixed(2)}`;
      ws.getCell(filaTotal, 12).value = `Total = ${totalConIGV.toFixed(2)}`;

      // === 4. Insertar imágenes inmediatamente después de la fila de totales ===
      // === 4. Insertar imágenes inmediatamente después de la fila de totales ===
      const filaInicioImg = filaTotal;

      const imagenes = [
        {
          url: 'https://raw.githubusercontent.com/LudoxAeterna1412/SWGAC/71a56b1319a5836dfeefd14f03b6c0f34c54fc87/src/resources/img/9.JPG',
          tl: { col: 0, row: filaInicioImg },       // A:{filaInicioImg}
          br: { col: 14, row: filaInicioImg + 15 }, // N:{filaInicioImg + 15}
        },
        {
          url: 'https://raw.githubusercontent.com/LudoxAeterna1412/SWGAC/71a56b1319a5836dfeefd14f03b6c0f34c54fc87/src/resources/img/10.JPG',
          tl: { col: 0, row: filaInicioImg + 15 },
          br: { col: 14, row: filaInicioImg + 38 },
        },
        {
          url: 'https://raw.githubusercontent.com/LudoxAeterna1412/SWGAC/71a56b1319a5836dfeefd14f03b6c0f34c54fc87/src/resources/img/11.JPG',
          tl: { col: 0, row: filaInicioImg + 38 },
          br: { col: 14, row: filaInicioImg + 55 },
        },
      ];

      for (const img of imagenes) {
        const response = await axios.get(img.url, { responseType: 'arraybuffer' });
        const imageId = wb.addImage({
          buffer: Buffer.from(response.data),
          extension: 'jpeg',
        });
        ws.addImage(imageId, {
          tl: img.tl,
          br: img.br,
          editAs: 'absolute',
        });
      }

      for (const img of imagenes) {
        const response = await axios.get(img.url, { responseType: 'arraybuffer' });
        const imageId = wb.addImage({
          buffer: Buffer.from(response.data),
          extension: 'jpeg',
        });
        ws.addImage(imageId, {
          tl: img.tl,
          br: img.br,
          editAs: 'absolute',
        });
      }

      const buffer = await wb.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Cotizacion.xlsm"');
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
