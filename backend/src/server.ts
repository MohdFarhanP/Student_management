import { server } from './app';
import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

const PORT = process.env.PORT || 5000;

server
  .listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  })
  .on('error', (err) => {
    logger.error('Server failed to start:', err.message);
  });
