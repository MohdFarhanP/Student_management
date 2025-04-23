import { Server as SocketIOServer } from 'socket.io';

export interface ISocketServer {
  initialize(): void;
  getIo(): SocketIOServer;
}