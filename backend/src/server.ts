import { server } from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

server
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .on('error', (err) => {
    console.error('Server failed to start:', err.message);
  });
