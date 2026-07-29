import mongoose from 'mongoose';

export let lastDbError = null;

const connectDB = async () => {
  try {
    const rawUri = (process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '').trim();
    if (!rawUri) {
      lastDbError = 'No MONGODB_URI or MONGO_URI environment variable configured on host.';
      console.error('Database Connection Error: MONGODB_URI environment variable is missing.');
      return;
    }

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
