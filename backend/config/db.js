import mongoose from 'mongoose';

export let lastDbError = null;

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || process.env.MONGO_URL;
    console.log(`Attempting MongoDB connection (URI length: ${rawUri.length})...`);
    
    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000,
    });
    lastDbError = null;
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    lastDbError = error.message;
    console.error(`Database Connection Error: ${error.message}`);
  }
};

export default connectDB;
