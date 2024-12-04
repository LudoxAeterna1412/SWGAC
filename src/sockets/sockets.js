module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log("Nuevo cliente conectado");

    // Manejar evento de desconexión
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });

    // Manejar otros eventos
    socket.on("mensaje", (data) => {
      console.log("Mensaje recibido:", data);
      // Puedes emitir un evento de vuelta al cliente si es necesario
      socket.emit("respuesta", { mensaje: "Mensaje recibido" });
    });

    socket.on("otroEvento", (data) => {
      console.log("Otro evento recibido:", data);
      // Lógica para manejar otro evento
    });

    // Agrega más eventos según sea necesario
  });
};
