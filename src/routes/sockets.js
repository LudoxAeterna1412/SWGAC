const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('message', (data) => {
      console.log('Message received: ', data);
      io.emit('message', data);
    });

    // Add more socket event handlers here
  });
};
