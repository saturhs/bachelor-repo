import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to the .env file');
}

export const connectToDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log('Connected to MongoDB');
      return connection;
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};