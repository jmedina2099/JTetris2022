export class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('score', (value) => this.handleMessage(value));
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }
  
  sendScore(score) {
    this.io.sockets.emit('score', score);
  }
  
  sendBoard(board) {
    this.io.sockets.emit('board', board);
  }
}

export function connection(io,socketConection) {
  io.on('connection', (socket) => {
    socketConection[0] = new Connection(io, socket);
  });
};