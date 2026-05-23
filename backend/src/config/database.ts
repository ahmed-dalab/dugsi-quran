import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (options?: { exitOnFailure?: boolean }) => {
  const exitOnFailure = options?.exitOnFailure ?? true;

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(env.DATABASE_URL);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }
};