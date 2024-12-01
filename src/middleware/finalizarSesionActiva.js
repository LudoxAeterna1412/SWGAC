const User = require("../model/usuario_Model");

async function finalizarSesionActiva(user) {
  try {
    if (user.usuario_sesion) {
      //Finalizar la sesión activa
      const updatedUser = await User.update(user._id, { usuario_sesion: null });
      //console.log(`Sesión previa para el usuario ${user.usuario_email} cerrada.`);
      return updatedUser; // Retorna el usuario actualizado si se necesita en otra lógica
    } else {
      //console.log(`Nueva sesión para el usuario ${user.usuario_email} abierta.`);
    }
  } catch (error) {
    console.error(`Error al cerrar la sesión previa para el usuario ${user.usuario_email}:`, error);
    throw new Error("No se pudo cerrar la sesión previa.");
  }
}

module.exports = finalizarSesionActiva;
