const User = require("../model/usuario_Model");
const Controller = require("./cls_wraper_Controller");
const path = require("path");

class auth_Controller extends Controller {

  async login(req, res) {
    try {
      const { usuario_email, usuario_password } = req.body;
      const user = await User.getByEmail(usuario_email);
      
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
  
      if (user.usuario_password !== usuario_password) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
  
      res.status(200).json({ message: "Login exitoso", user });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }



  
  index(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views/auth", "login.html"));
  }

  
  dashboard(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "index.html"));
  }

}

module.exports = new auth_Controller();
