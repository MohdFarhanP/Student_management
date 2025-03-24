import mongoose, { connection } from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(
      (process.env.MONOGOURI as string) ||
        'mongodb+srv://farhan:CbgqwaKicLRH8UeS@cluster0.vbk9f.mongodb.net/studentManagement'
    );
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('MongoDB connection Failed:', error);
    process.exit(1);
  }
};
