import { io, Socket } from 'socket.io-client';

const PORT = import.meta.env.VITE_SOCKET_URL ;

export const socket: Socket = io(PORT, {
  reconnection: true,
  reconnectionAttempts: 3,
  transports: ['websocket', 'polling'],
  reconnectionDelay: 1000,
  autoConnect: false,
  path: '/socket.io/',
  query: {},
});

socket.on('connect', () => {
  console.info('Socket.IO connected successfully, socket ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Socket.IO connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.info('Socket.IO disconnected, reason:', reason);
});

socket.on('reconnect', (attempt) => {
  console.info('Socket.IO reconnected after attempt:', attempt);
});

socket.on('reconnect_error', (err) => {
  console.error('Socket.IO reconnect error:', err.message);
});