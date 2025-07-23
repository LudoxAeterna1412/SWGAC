// Import models
const ExcelJS = require('exceljs');
const path = require('path');
const ItemModel = require('../model/items_cotizacion_Model');
const Cotizacion = require('../model/cotizacion_Model');
const PagoModel = require('../model/pago_cotizacion_Model');
const axios = require('axios');
const convertir = require('numero-a-letras');



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

      // === 1. Determinar archivo según tipo ===
      const tipo = cotizacion.tipo?.toLowerCase() || 'publico';
      let plantillaPath = 'src/resources/formats/cotizacion_publico.xlsm';
      if (tipo === 'privado') {
        plantillaPath = 'src/resources/formats/cotizacion_privado.xlsm';
      }

      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(plantillaPath);
      const ws = wb.getWorksheet('format');

      // === 2. Cargar modelos ===
      const pagos = await PagoModel.getByCodigo(codigo);
      const items = await ItemModel.getByCodigo(codigo);
      const n_items = items.length;

      // === 3. Insertar campos fijos ===
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

      // === 4. Preparar plantilla de estilos para ítems ===
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

      const filaTotal = filaBase + n_items;
      ws.getCell(filaTotal, 10).value = `Total = ${totalSinIGV.toFixed(2)}`;
      ws.getCell(filaTotal, 12).value = `Total = ${totalConIGV.toFixed(2)}`;

      // === 5. Imágenes ===
      const filaInicioImg = filaTotal;
      const imagenes = [
        {
          url: 'https://raw.githubusercontent.com/LudoxAeterna1412/SWGAC/71a56b1319a5836dfeefd14f03b6c0f34c54fc87/src/resources/img/9.JPG',
          tl: { col: 0, row: filaInicioImg },
          br: { col: 14, row: filaInicioImg + 15 },
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
        const imageId = wb.addImage({ buffer: Buffer.from(response.data), extension: 'jpeg' });
        ws.addImage(imageId, { tl: img.tl, br: img.br, editAs: 'absolute' });
      }

      // === 6. Logo cabecera ===
      const imgURL = 'https://raw.githubusercontent.com/LudoxAeterna1412/SWGAC/4076203ad7c64d509e9203ffcbe196443258de77/src/resources/img/6.jpg';
      const responseImg6 = await axios.get(imgURL, { responseType: 'arraybuffer' });
      const img6Id = wb.addImage({ buffer: Buffer.from(responseImg6.data), extension: 'jpeg' });
      ws.addImage(img6Id, {
        tl: { col: 1, row: 2 },
        br: { col: 3, row: 5 },
        editAs: 'absolute'
      });

      // === 7. Enviar archivo ===
      const buffer = await wb.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Cotizacion.xlsm"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);

    } catch (error) {
      console.error('Error exportando Excel:', error);
      return res.status(500).send(error.message);
    }
  }

  //$B$2:$C$4  rango para pegar el logo de cautiva
  //asegurar que se actualize el pago y la bomba, solo actualiza si reconoce el codigo,
  async exportTicket(req, res) {
    try {
      const { codigo } = req.query;
      const cotizacion = await Cotizacion.getByCodigo(codigo);
      if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });

      const items = await ItemModel.getByCodigo(codigo);
      const pagos = await PagoModel.getByCodigo(codigo);
      const pagoSeleccionado = pagos?.[0];

      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile('src/resources/formats/ticket.xlsm');
      const ws = wb.getWorksheet('ticket');
      if (!ws) return res.status(500).send('La hoja "ticket" no existe en la plantilla');

      // === Estilos base de A22:E23
      const estiloSuperior = {};
      const estiloInferior = {};
      for (let col = 1; col <= 5; col++) {
        estiloSuperior[col] = {
          font: ws.getCell(22, col).font,
          fill: ws.getCell(22, col).fill,
          alignment: ws.getCell(22, col).alignment,
          border: ws.getCell(22, col).border,
          numFmt: ws.getCell(22, col).numFmt
        };
        estiloInferior[col] = {
          font: ws.getCell(23, col).font,
          fill: ws.getCell(23, col).fill,
          alignment: ws.getCell(23, col).alignment,
          border: ws.getCell(23, col).border,
          numFmt: ws.getCell(23, col).numFmt
        };
      }

      // === Datos cabecera
      const ahora = new Date();
      const fechaFormateada = ahora.toLocaleDateString('es-PE');
      const horaFormateada = ahora.toLocaleTimeString('es-PE', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      const campos = [
        { celda: 'B15', valor: cotizacion.codigo },
        { celda: 'C16', valor: cotizacion.cliente || '' },
        { celda: 'C17', valor: cotizacion.dni || '' },
        { celda: 'C18', valor: cotizacion.celular || '' },
        { celda: 'B19', valor: fechaFormateada },
        { celda: 'D19', valor: horaFormateada }
      ];
      for (const campo of campos) {
        ws.getCell(campo.celda).value = campo.valor;
      }

      // === Insertar ítems desde A22
      let fila = 22;
      let totalSinIGV = 0;

      for (const item of items) {
        const filaSup = fila;
        const filaInf = fila + 1;

        // Limpiar celdas A–E
        for (let col = 1; col <= 5; col++) {
          ws.getCell(filaSup, col).value = null;
          ws.getCell(filaInf, col).value = null;
        }

        // Fila superior
        ws.getCell(filaSup, 1).value = item.metros_cubicos || 0;
        ws.getCell(filaSup, 2).value = 'm3';
        ws.getCell(filaSup, 3).value = item.codigo_diseno || '';
        ws.getCell(filaSup, 4).value = item.precio_unitario || 0;
        ws.getCell(filaSup, 5).value = item.total_item || 0;
        totalSinIGV += item.total_item || 0;

        for (let col = 1; col <= 5; col++) {
          const cellSup = ws.getCell(filaSup, col);
          const cellInf = ws.getCell(filaInf, col);
          if (estiloSuperior[col]) Object.assign(cellSup, { ...estiloSuperior[col] });
          if (estiloInferior[col]) Object.assign(cellInf, { ...estiloInferior[col] });
        }

        // Fila inferior
        ws.getCell(filaInf, 1).value = item.descripcion || '';

        fila += 2;
      }

      // === Copiar bloque final desde ticket_mod
      const wbMod = new ExcelJS.Workbook();
      await wbMod.xlsx.readFile('src/resources/formats/ticket_mod.xlsm');
      const wsMod = wbMod.getWorksheet('mod');
      if (!wsMod) return res.status(500).send('La hoja "mod" no existe en ticket_mod.xlsm');

      for (let row = 1; row <= 15; row++) { // antes 12, ahora 15 filas
        for (let col = 1; col <= 5; col++) { // columnas A–E
          const origen = wsMod.getCell(row, col);
          const destino = ws.getCell(fila + row - 1, col);

          //  CORRECCIN: Evitar que se copien formulas existentes
          if (origen.formula) {
            destino.value = origen.result ?? null;  // Usa el valor calculado si exist
          } else {
            destino.value = origen.value;
          }

          // Estilos 
          if (origen.font) destino.font = { ...origen.font };
          if (origen.fill) destino.fill = { ...origen.fill };
          if (origen.alignment) destino.alignment = { ...origen.alignment };
          if (origen.border) destino.border = { ...origen.border };
          if (origen.numFmt) destino.numFmt = origen.numFmt;
        }
      }
      //  Insertar totales y datos de pago dinámicamente
      const igv = totalSinIGV * 0.18;
      const totalConIGV = totalSinIGV + igv;

      const filaResumen = fila; // bloque mod inicia aquí|



      ws.getCell(`E${filaResumen}`).value = parseFloat(totalSinIGV.toFixed(2));
      ws.getCell(`E${filaResumen + 1}`).value = parseFloat(igv.toFixed(2));
      ws.getCell(`E${filaResumen + 2}`).value = parseFloat(totalConIGV.toFixed(2));


      if (pagoSeleccionado) {
        //tanteamos esta mmda
        const filaCondicionVenta = filaResumen + 5;
        const filaFormaPago = filaResumen + 6;
        const filaMontoPago = filaResumen + 7;
        const filamonto_saldo = filaResumen + 10;

        ws.getCell(`D${filaCondicionVenta}`).value = pagoSeleccionado.condicion_venta || '';
        ws.getCell(`D${filaFormaPago}`).value = pagoSeleccionado.forma_pago || '';
        ws.getCell(`E${filaMontoPago}`).value = parseFloat(pagoSeleccionado.monto_pago || 0);
        ws.getCell(`E${filamonto_saldo}`).value = parseFloat(pagoSeleccionado.monto_saldo || 0);


        const totalLetras = convertir.NumerosALetras(totalConIGV)

          .replace(/pesos/i, 'SOLES')
          .replace(/m\.?n\.?/i, 'S/.')
          .trim()
          .toUpperCase();

        // monto_pago a letras
        const pagoLetras = convertir.NumerosALetras(pagoSeleccionado?.monto_pago || 0)

          .replace(/pesos/i, 'SOLES')
          .replace(/m\.?n\.?/i, 'S/.')
          .trim()
          .toUpperCase();

        // monto_saldo a letras
        const saldoLetras = convertir.NumerosALetras(pagoSeleccionado?.monto_saldo || 0)

          .replace(/pesos/i, 'SOLES')
          .replace(/m\.?n\.?/i, 'S/.')
          .trim()
          .toUpperCase();

        ws.getCell(`B${filaResumen + 3}`).value = totalLetras;       // B29
        ws.getCell(`B${filaResumen + 8}`).value = pagoLetras;       // B34
        ws.getCell(`B${filaResumen + 11}`).value = saldoLetras;      // B37



      }

      // === Exportar archivo
      const buffer = await wb.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', `attachment; filename="Ticket_Venta_${codigo}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);

    } catch (error) {
      console.error('Error exportando ticket:', error);
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
