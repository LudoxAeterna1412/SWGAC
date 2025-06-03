// get instance of app from express
const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Importamos crypto

const {
    auth_Controller,
    usuario_Controller,
    notificacion_Controller,
    cotizacion_Controller,
    items_Cotizacion_Controller
} = require('../controllers/barrel_Controller');

// declara los Routes para utilizar prefijos
const authRoutes = express.Router();
const userRoutes = express.Router();
const cotizacionRoutes = express.Router();
const items_cotizacionRoutes = express.Router();
const notificacionRoutes = express.Router();

/* ==============================
   Auth Controller Routes
   ============================== */
authRoutes.post('/login', auth_Controller.login);

/* ==============================
   items_Cotizacion Controller Routes
   ============================== */
// Obtener todos los ítems
items_cotizacionRoutes.get('/records', items_Cotizacion_Controller.records);
items_cotizacionRoutes.post('/getByCodigo', items_Cotizacion_Controller.getByCodigo);
items_cotizacionRoutes.post('/getById', items_Cotizacion_Controller.getById);
items_cotizacionRoutes.post('/store', items_Cotizacion_Controller.store);
items_cotizacionRoutes.put('/update/:id', items_Cotizacion_Controller.update);
items_cotizacionRoutes.delete('/delete/:id', items_Cotizacion_Controller.delete);
items_cotizacionRoutes.get('/gestor', items_Cotizacion_Controller.gestor_items);

/* ==============================
   Usuario Controller Routes
   ============================== */
userRoutes.post('/getUser', usuario_Controller.getUser);
userRoutes.get('/records', usuario_Controller.records);
userRoutes.post('/store', usuario_Controller.store);
userRoutes.delete('/delete/:id', usuario_Controller.delete);
userRoutes.post('/getUserById', usuario_Controller.getUserById);
userRoutes.put('/update/:id', usuario_Controller.update);
userRoutes.put('/updateModal/:id', usuario_Controller.updateModal);

/* ==============================
   Cotización Controller Routes
   ============================== */
cotizacionRoutes.post('/getCotizacion', cotizacion_Controller.getCotizacion);
cotizacionRoutes.get('/records', cotizacion_Controller.records);
cotizacionRoutes.post('/store', cotizacion_Controller.store);
cotizacionRoutes.delete('/delete/:id', cotizacion_Controller.delete);
cotizacionRoutes.post('/getById', cotizacion_Controller.getById);
cotizacionRoutes.put('/update/:id', cotizacion_Controller.update);
cotizacionRoutes.put('/updateModal/:id', cotizacion_Controller.updateModal);
cotizacionRoutes.get('/export', cotizacion_Controller.exportExcel);
//cotizacionRoutes.get('/gestor', cotizacion_Controller.gestor_cotizaciones);

/* ==============================
   Notificación Controller Routes
   ============================== */
notificacionRoutes.get('/records', notificacion_Controller.records);
notificacionRoutes.post('/store', notificacion_Controller.store);
notificacionRoutes.delete('/delete/:id', notificacion_Controller.delete);
notificacionRoutes.post('/getNotificacionById', notificacion_Controller.getNotificacionById);
notificacionRoutes.put('/update/:id', notificacion_Controller.update);

// Nueva ruta para enviar correos desde `notificacion_Controller`
notificacionRoutes.post('/sendEmail', async (req, res) => {
    const { to, subject, message } = req.body;

    // Validamos que los campos requeridos estén presentes
    if (!to || !subject || !message) {
        return res.status(400).json({ message: "Los campos 'to', 'subject' y 'message' son obligatorios." });
    }

    try {
        // Llamamos al controlador para enviar el correo
        const emailResult = await notificacion_Controller.sendEmail(to, subject, message);

        // Si el correo se envió correctamente, respondemos con éxito
        if (emailResult.success) {
            return res.status(200).json({
                message: 'Correo enviado exitosamente.',
                messageId: emailResult.messageId
            });
        } else {
            // Si hubo un error al enviar el correo, lo devolvemos en la respuesta
            return res.status(500).json({
                message: 'Error al enviar el correo.',
                error: emailResult.error
            });
        }
    } catch (err) {
        // Si ocurre cualquier error en los métodos asíncronos, lo capturamos aquí
        console.error('Error en /sendEmail:', err.message);
        return res.status(500).json({
            message: 'Error interno del servidor.',
            error: err.message
        });
    }
});

/* ==============================
   Asignación de prefijos
   ============================== */
router.use('/auth', authRoutes);             // prefijo auth
router.use('/usuario', userRoutes);          // prefijo usuario
router.use('/cotizacion', cotizacionRoutes); // prefijo cotizacion
router.use('/items_cotizacion', items_cotizacionRoutes); // prefijo cotizacion
router.use('/notificacion', notificacionRoutes); // prefijo notificacion

module.exports = router;
