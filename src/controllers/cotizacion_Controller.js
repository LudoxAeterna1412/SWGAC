// Import models
const ExcelJS = require('exceljs');
const Cotizacion = require('../model/cotizacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require('path');

// Servicio de generación de Excel
async function generateCotizacionesExcel(cotizaciones) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('src/resources/formats/cotizacion.xlsm');

  const ws = wb.getWorksheet('format');
  const c = cotizaciones[0];

  // Ubicaciones fijas según tu diseño:
  ws.getCell('N5').value = c.codigo;
  ws.getCell('M5').value = c.fecha.toISOString().split('T')[0];
  ws.getCell('E12').value = c.cliente;
  ws.getCell('M12').value = c.tipo;
  ws.getCell('E13').value = c.dni || '';
  ws.getCell('E14').value = c.ruc || '';
  // Nuevos campos:
  ws.getCell('E15').value = c.codigo_certificacion || '';
  ws.getCell('E16').value = c.estructura || '';
  ws.getCell('E17').value = c.asesor || '';
  ws.getCell('E18').value = c.celular || '';
  ws.getCell('E19').value = c.maestro || '';

  ws.getCell('E23').value = c.descripcion || '';
  ws.getCell('M12').value = c.colocado ? 'Sí' : 'No';
  ws.getCell('I23').value = c.metros_cubicos;
  ws.getCell('M24').value = c.total;

  // Buffer
  return await wb.xlsx.writeBuffer();
};

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
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total } = req.body;

      // Validación básica
      if (!codigo || !fecha || !cliente || !tipo) {
        return res.status(400).json({ message: 'Los campos codigo, fecha, cliente y tipo son obligatorios.' });
      }

      // Crear la nueva cotización usando el modelo personalizado
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
        total
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
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total } = req.body;
      // Validación mínima
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
        total
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
      const { codigo, fecha, cliente, tipo, dni, ruc, codigo_certificacion, estructura, asesor, celular, maestro, email, estado, total } = req.body;

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
        total
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
  async exportExcel(req, res) {
    try {
      const { codigo } = req.query; // Leer 'codigo' desde query string (puede venir o no)
      let cotizaciones = [];

      if (codigo) {
        const cotizacion = await Cotizacion.getByCodigo(codigo); // <-- Cambio aquí
        if (!cotizacion) {
          return res.status(404).json({ message: 'Cotización no encontrada' });
        }
        cotizaciones.push(cotizacion); // Convertir en array
      } else {
        cotizaciones = await Cotizacion.getAll(); // Si no hay código, obtener todas
      }

      const buffer = await generateCotizacionesExcel(cotizaciones);

      res.setHeader('Content-Disposition', 'attachment; filename="cotizaciones.xlsx"');
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
