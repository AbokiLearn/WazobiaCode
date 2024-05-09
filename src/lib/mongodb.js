import mongoose from 'mongoose';

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
  } catch (error) {
    console.log('database connection failed');
    console.log(error);
  }
};

export default connectMongoDb;
