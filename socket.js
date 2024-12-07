const socketIO = require('socket.io')

let io;

const initSocket = (server) => {
    io = socketIO(server);

    io.on("connection", (socket) => {
    });
}

const getIO = () => {
    return io;
}

module.exports = {
    initSocket,
    getIO
}