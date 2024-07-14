import mongoose from 'mongoose';
import { env } from '@/lib/config';

const connectMongoDb = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to database');
  } catch (error) {
    console.log('database connection failed');
    console.log(error);
  }
};

export default connectMongoDb;
