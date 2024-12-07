//get instance of app from express
const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Importamos crypto
const { auth_Controller,
    usuario_Controller,
    viaje_Controller,
    gps_Controller,
    ruta_Controller,
    notificacion_Controller,
    det_viaje_gps_Controller,
    det_viaje_usuario_Controller   } = require('../controllers/barrel_Controller');

//declara los Routes para utilizar prefijos
const userRoutes = express.Router();
const authRoutes = express.Router();
const viajeRoutes = express.Router();
const notificacionRoutes = express.Router();
const det_viaje_gpsRoutes = express.Router();
const det_viaje_usuarioRoutes = express.Router();

det_viaje_gpsRoutes.get('/records', det_viaje_gps_Controller.records);

det_viaje_usuarioRoutes.get('/records', det_viaje_usuario_Controller.records);
det_viaje_usuarioRoutes.get('/getDetById/:id', det_viaje_usuario_Controller.getDetById);

det_viaje_usuarioRoutes.get('/getDetByUsuario/:usuario_id', det_viaje_usuario_Controller.getDetByUsuario);
det_viaje_usuarioRoutes.get('/getDetByViaje/:viaje_id', det_viaje_usuario_Controller.getDetByViaje);

authRoutes.post('/login', auth_Controller.login);

userRoutes.post('/getUser', usuario_Controller.getUser);
userRoutes.get('/records', usuario_Controller.records);
userRoutes.post('/store', usuario_Controller.store);
userRoutes.delete('/delete/:id', usuario_Controller.delete);
userRoutes.post('/getUserById', usuario_Controller.getUserById);
userRoutes.put('/update/:id', usuario_Controller.update);
userRoutes.put('/updateModal/:id', usuario_Controller.updateModal);

notificacionRoutes.get('/records', notificacion_Controller.records);
notificacionRoutes.post('/store', notificacion_Controller.store);
notificacionRoutes.delete('/delete/:id', notificacion_Controller.delete);
notificacionRoutes.post('/getNotificacionById', notificacion_Controller.getNotificacionById);
notificacionRoutes.put('/update/:id', notificacion_Controller.update);

// Nueva ruta para enviar correos desde `notificacion_Controller` // da error pero funciona....ha de ser por las respuestas que esperamos devuelva al hacerlo..
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



viajeRoutes.get('/records', viaje_Controller.records);
viajeRoutes.post('/getViajeById', viaje_Controller.getViajeById);
viajeRoutes.post('/store', viaje_Controller.store);
viajeRoutes.delete('/delete/:id', viaje_Controller.delete);
viajeRoutes.put('/update/:id', viaje_Controller.update);

//forma de poner prefijos a las rutas
router.use('/auth', authRoutes); // prefijo auth
router.use('/usuario', userRoutes); // prefijo users
router.use('/viaje', viajeRoutes); // prefijo 
router.use('/notificacion', notificacionRoutes); // prefijo 
router.use('/det_viaje_gps', det_viaje_gpsRoutes); // prefijo 
router.use('/det_viaje_usuario', det_viaje_usuarioRoutes); // prefijo 
module.exports = router;