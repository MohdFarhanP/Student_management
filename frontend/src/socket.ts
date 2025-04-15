import io from 'socket.io-client';

const PORT = import.meta.env.VITE_SOCKET_URL;

export const socket = io(PORT, {
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

socket.on('connect_error', (err) => {
  console.error('Socket.IO connection error:', err.message);
});
