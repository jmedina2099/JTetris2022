export class Connection {
  constructor(io, socket, channels) {
    this.socket = socket;
    this.io = io;
    this.channels = channels;

    socket.on('figuraCayendo', (value) => {
      //console.log( 'from Back publish figuraCayendo='+value );
      if( this.channels.channelFiguraCayendo ) {
        this.channels.channelFiguraCayendo.publish("","figure-falling-queue",Buffer.from(value),null);
      }
    });
    socket.on('figuras', (value) => {
      //console.log( 'from Back publish figuras='+value );
      if( this.channels.channelFiguras ) {
        this.channels.channelFiguras.publish("","figures-queue",Buffer.from(value),null);
      }
    });
    socket.on('board', (value) => {
      //console.log( 'from Back publish board='+value );
      if( this.channels.channelBoard ) {
        this.channels.channelBoard.publish("","board-queue",Buffer.from(value),null);
      }
    });
    socket.on('score', (value) => {
      //console.log( 'from Back publish score='+value );
      if( this.channels.channelScore ) {
        this.channels.channelScore.publish("","score-queue",Buffer.from(value),null);
      }
    });
    socket.on('hash', (value) => {
      //console.log( 'from Back publish hash='+value );
      if( this.channels.channelHash ) {
        this.channels.channelHash.publish("","hash-board-queue",Buffer.from(value),null);
      }
    }); 
  }
  
  sendScore(score) {
    //console.log( 'Emit SCORE to Front...' );
    this.io.sockets.emit('score', score);
  }
  
  sendBoard(board) {
    //console.log( 'Emit BOARD to Front...' );
    this.io.sockets.emit('board', board);
  }

  sendHash(hash) {
    //console.log( 'Emit HASH to Front...' );
    this.io.sockets.emit('hash', hash);
  }

  sendFigures(figures) {
    //console.log( 'Emit FIGURAS to Front...' );
    this.io.sockets.emit('figures', figures);
  }

  sendFigureFalling(figure) {
    //console.log( 'Emit FIGURA CAYENDO to Front...' );
    this.io.sockets.emit('figure_falling', figure);
  }
}

export function connection(io,socketConection,channels) {
  io.on('connection', (socket) => {
    console.log( 'Getting connection!' );
    try {
      socketConection[0] = new Connection(io, socket, channels);
    } catch(error) {
      console.error( "********************** ERROR on connection()" );
      console.error(error);      
    }
  });
};