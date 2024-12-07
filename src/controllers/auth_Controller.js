const User = require("../model/usuario_Model");
const Controller = require("./cls_wraper_Controller");
const path = require("path");
const crypto = require('crypto');
const finalizarSesionActiva = require("../middleware/finalizarSesionActiva");

class auth_Controller extends Controller {

  // Método de login que usa finalizarSesionActiva
  async login(req, res) {
    try {
      const { usuario_email, usuario_password } = req.body;

      // Buscar usuario por correo electrónico
      const user = await User.getByEmail(usuario_email);

      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      // Verificar contraseña
      if (user.usuario_password !== usuario_password) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      // Finalizar cualquier sesión activa previa
      await finalizarSesionActiva(user);

      // Generar un token único para la nueva sesión
      const sessionToken = crypto.randomBytes(16).toString("hex");

      // Actualizar la sesión y última fecha de inicio de sesión
      const updatedUser = await User.update(user._id, {
        usuario_sesion: sessionToken,
        usuario_ultimasesion: new Date(),
      });
      // Devolver respuesta exitosa
      res.status(200).json({
        message: "Login exitoso",
        user: {
          usuario_nombre: updatedUser.usuario_nombre,
          usuario_email: updatedUser.usuario_email,
          usuario_tipo: updatedUser.usuario_tipo,
          usuario_sesion: updatedUser.usuario_sesion, // Token de sesión
        },
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  index(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views/auth", "login.html"));
  }

  // Renderizar la vista del gestor de usuarios con EJS
  dashboard(req, res) {
    res.render('dashboard', {  // Usamos res.render para renderizar la vista EJS
    });
  }
  // Renderizar la vista del gestor de usuarios con EJS
  registrar_usuario(req, res) {
    res.render('registrar_usuario', {  // Usamos res.render para renderizar la vista EJS
    });
  }
}

// Esta parte asegura que el controlador tiene todos los métodos envueltos en asyncHandler
module.exports = new auth_Controller();
