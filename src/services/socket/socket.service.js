import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection () {
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      transports: ['polling', 'websocket'],
      secure: true,
      upgrade: true,
      reconnection: true,
      timeout: 20000,
    });
    this.socketConnectionEvents();
  }

  socketConnectionEvents () {
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('disconnect', (reason) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
    })
    this.socket.on('connect_error', (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect();
    })
  }
}

export const socketService = new SocketService();


// So the transport connection, available web sockets and long pulling.
// So the default is long pulling.
// But if you set it as a web socket, then if there's an issue with a web socket connection, then socket
// you will not be able to have any fallback to long pulling.
// But I think this is fine.
