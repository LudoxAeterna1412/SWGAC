// Import models
const User = require('../model/usuario_Model');
const Controller = require('./cls_wraper_Controller');
const path = require("path");
class usuario_Controller extends Controller {
  // Obtener todos los usuarios
  async records(req, res) {
    try {
      const users = await User.getAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  // Crear un nuevo usuario
  async store(req, res) {
    try {
      const { usuario_nombre, usuario_email, usuario_password, usuario_tipo } = req.body;
      // Validación básica
      if (!usuario_nombre || !usuario_email || !usuario_password || !usuario_tipo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
      // Crear usuario
      const newUser = await User.create({
        usuario_nombre,
        usuario_email,
        usuario_password,
        usuario_tipo,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { usuario_nombre, usuario_tipo } = req.body;

      // Validación básica
      if (!usuario_nombre || !usuario_tipo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
      // Actualizar usuario
      const updatedUser = await User.update(id, {
        usuario_nombre,
        usuario_tipo,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      return res.status(200).json(updatedUser);
    } catch (error) { 
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }


  // Eliminar un usuario
  async delete(req, res) {
    try {
      const { id } = req.params;
      // Eliminar usuario
      const deletedUser = await User.delete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      return res.status(200).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
  // Renderizar la vista del gestor de usuarios
  gestor_usuarios(req, res) {
    res.sendFile(path.join(__dirname, "../resources/views", "gestor_usuarios.html"));
  }
}

module.exports = new usuario_Controller();
