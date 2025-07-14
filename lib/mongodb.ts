import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'test'; // 'test' en fallback

  if (!uri) throw new Error("MONGODB_URI not set");

  try {
    await mongoose.connect(uri, {
      dbName,  // spécifie la base à utiliser
    });
    isConnected = true;
    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
