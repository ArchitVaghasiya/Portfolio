import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let isMongoConnected = false

export async function connectDB() {
  // If already connected or connecting (e.g. in serverless warm instance), reuse connection
  if (mongoose.connection.readyState >= 1) {
    isMongoConnected = true
    return
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb'

  try {
    // Set 2 second timeout for connection attempt
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
    isMongoConnected = true
    console.log('✅ MongoDB connected successfully to', mongoUri)
  } catch (err) {
    isMongoConnected = false
    console.warn(
      '⚠️ MongoDB not reachable (' + err.message + '). Falling back to in-memory store for Tasks.',
    )
  }
}

export function isDbConnected() {
  return isMongoConnected
}
