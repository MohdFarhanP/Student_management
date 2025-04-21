import io from 'socket.io-client';

const PORT = import.meta.env.VITE_SOCKET_URL;

export const socket = io(PORT, {
  reconnection: true,
  reconnectionAttempts: 3,
  transports: ['websocket', 'polling'],
  reconnectionDelay: 1000,
  autoConnect: false,
  query: {},
});

socket.on('connect_error', (err) => {
  console.error('Socket.IO connection error:', err.message);
});
