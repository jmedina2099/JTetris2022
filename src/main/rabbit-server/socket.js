export class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('score', (value) => this.handleMessage(value));
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socker.on('uncaughtException', (err) => {
      console.log(`uncaughtException ${err.message}`);
    });
    socker.on('error', (err) => {
      console.log(`error ${err.message}`);
    });    
  }
  
  sendScore(score) {
    this.io.sockets.emit('score', score);
  }
  
  sendBoard(board) {
    this.io.sockets.emit('board', board);
  }

  sendHash(hash) {
    this.io.sockets.emit('hash', hash);
  }

  sendFigures(figures) {
    this.io.sockets.emit('figures', figures);
  }

  sendFigureFalling(figure) {
    this.io.sockets.emit('figure_falling', figure);
  }
}

export function connection(io,socketConection) {
  io.on('connection', (socket) => {
    try {
      socketConection[0] = new Connection(io, socket);
    } catch(error) {
      console.error( "********************** ERROR on connection()" );
      console.error(error);      
    }
  });
};