import mongoose from 'mongoose';
import { env } from '@/lib/config';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    console.log('database connection failed');
    console.log(error);
  }
};

export default connectMongoDB;
