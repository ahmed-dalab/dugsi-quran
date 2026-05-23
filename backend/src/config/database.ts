import mongoose from "mongoose";
import { env } from "./env";

let connectionPromise: Promise<typeof mongoose> | null = null;

const getSanitizedDbTarget = (url: string) => {
  try {
    const parsed = new URL(url.replace("mongodb+srv://", "https://").replace("mongodb://", "http://"));
    return parsed.hostname || "unknown-host";
  } catch {
    return "invalid-url";
  }
};

export const connectDB = async (options?: { exitOnFailure?: boolean }) => {
  const exitOnFailure = options?.exitOnFailure ?? true;

  if (!env.DATABASE_URL) {
    const message = "DATABASE_URL is missing. Add it in Vercel → Settings → Environment Variables.";
    console.error(message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw new Error(message);
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.DATABASE_URL, {
        serverSelectionTimeoutMS: 20_000,
        socketTimeoutMS: 45_000,
        maxPoolSize: 10,
      })
      .then((connection) => {
        console.log(`✅ MongoDB connected (${getSanitizedDbTarget(env.DATABASE_URL)})`);
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("❌ MongoDB connection failed");
        console.error(`Target host: ${getSanitizedDbTarget(env.DATABASE_URL)}`);
        console.error(
          "Check Atlas Network Access allows 0.0.0.0/0 and DATABASE_URL credentials are correct on Vercel."
        );
        console.error(error);

        if (exitOnFailure) {
          process.exit(1);
        }

        throw error;
      });
  }

  return connectionPromise;
};

export const isDbConnected = () => mongoose.connection.readyState >= 1;
