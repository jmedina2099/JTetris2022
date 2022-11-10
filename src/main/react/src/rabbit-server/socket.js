class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('message', (value) => this.handleMessage(value));
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }
  
  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }
  
}

export function connection(io,socketConection) {
  io.on('connection', (socket) => {
    socketConection[0] = new Connection(io, socket);
  });
};
