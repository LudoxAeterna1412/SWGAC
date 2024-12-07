// Import models
const Notificacion = require('../model/notificacion_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");
const nodemailer = require('nodemailer');


// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  },
});


class notificacion_Controller extends Controller {

    // Función para enviar el correo
    async sendEmail(to, subject, message) {
      try {
          const info = await transporter.sendMail({
              from: { name: 'Correo S.W. Transporte Collasuyo', address: process.env.SMTP_USER }, // Remitente
              to, // Destinatario(s)
              subject, // Asunto del correo
              html: `<p>${message}</p>`, // Contenido en HTML
          });
  
          console.log('Correo enviado:', info.messageId);
          // Asegúrate de que siempre devuelvas un objeto con las propiedades 'success' y 'messageId'
          return { success: true, messageId: info.messageId };
      } catch (error) {
          console.error('Error al enviar el correo:', error);
          // Si hay un error, devolver un objeto con 'success' como false y el mensaje de error
          return { success: false, error: error.message };
      }
  }


  // Obtener todas las notificaciones
  async records(req, res) {
    try {
      const notificaciones = await Notificacion.getAll(); // Obtener todas las notificaciones
      return res.status(200).json(notificaciones);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  async getNotificacionById(req, res) {
    try {
      const { _id } = req.body; // Extraer el ID del cuerpo de la solicitud
      if (!_id) {
        return res.status(400).json({ message: "El ID de la notificación es requerido" });
      }
      const notificacion = await Notificacion.findById(_id); // Buscar notificación por ID
      if (!notificacion) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }
      return res.status(200).json(notificacion); // Retornar datos de la notificación
    } catch (error) {
      console.error("Error en getNotificacionById:", error);
      return res.status(500).send(error.message); // Manejar errores del servidor
    }
  }
  
  // Crear una nueva notificación
  async store(req, res) {
    try {
      const { notificacion_mensaje, notificacion_hora_programado, det_vu_id } = req.body;
      // Validación básica
      if (!notificacion_mensaje || !notificacion_hora_programado || !det_vu_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
      // Crear nueva notificación
      const newNotificacion = await Notificacion.create({
        notificacion_mensaje,
        notificacion_hora_programado,
        det_vu_id,
      });
      return res.status(201).json(newNotificacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Actualizar una notificación
  async update(req, res) {
    try {
      const { id } = req.params;
      const { notificacion_mensaje, notificacion_hora_programado, det_vu_id } = req.body;
      // Validación básica
      if (!notificacion_mensaje || !notificacion_hora_programado || !det_vu_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
      // Actualizar notificación
      const updatedNotificacion = await Notificacion.update(id, {
        notificacion_mensaje,
        notificacion_hora_programado,
        det_vu_id,
      });
      if (!updatedNotificacion) {
        return res.status(404).json({ message: "Notificación no encontrada." });
      }
      return res.status(200).json(updatedNotificacion);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Eliminar una notificación
  async delete(req, res) {
    try {
      const { id } = req.params;
      // Eliminar notificación
      const deletedNotificacion = await Notificacion.delete(id);
      if (!deletedNotificacion) {
        return res.status(404).json({ message: "Notificación no encontrada." });
      }
      return res.status(200).json({ message: "Notificación eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Renderizar la vista del gestor de notificaciones
  //gestor_notificaciones(req, res) {
  //  res.sendFile(path.join(__dirname, "../resources/views", "gestor_notificaciones.html"));
  //}
  gestor_notificaciones(req, res) {
    res.render('gestor_notificaciones', {  // Usamos res.render para renderizar la vista EJS
    });
  }
}
module.exports = new notificacion_Controller();
