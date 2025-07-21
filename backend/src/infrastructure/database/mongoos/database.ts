import mongoose from 'mongoose';
import logger from '../../../logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONOGOURI as string);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB connection Failed:', error);
    process.exit(1);
  }
};
