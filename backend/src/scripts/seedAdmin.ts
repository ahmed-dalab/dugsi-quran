import dotenv from "dotenv";

dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../modules/users/user.model";

const ADMIN = {
  name: "Ahmed",
  email: "ahmed@gmail.com",
  password: "admin123",
  role: "admin" as const,
  isActive: true,
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      console.log(`Admin already exists: ${ADMIN.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, env.HASH_SALT_ROUNDS);

    await User.create({
      ...ADMIN,
      password: hashedPassword,
    });

    console.log(`Admin user created: ${ADMIN.email}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

void seedAdmin();
