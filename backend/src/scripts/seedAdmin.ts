import dotenv from "dotenv";

dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/database";
import { env } from "../config/env";
import { userRepository } from "../modules/users/user.repository";

const ADMIN = {
  name: "Ahmed",
  email: "ahmed@gmail.com",
  password: "admin123",
  role: "admin" as const,
  isActive: true,
};

const seedAdmin = async () => {
  try {
    await connectDB({ exitOnFailure: true });
    console.log("Connected to PostgreSQL");

    const existing = await userRepository.findByEmailWithPassword(ADMIN.email);

    if (existing) {
      console.log(`Admin already exists: ${ADMIN.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, env.HASH_SALT_ROUNDS);

    await userRepository.create({
      ...ADMIN,
      password: hashedPassword,
    });

    console.log(`Admin user created: ${ADMIN.email}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
    console.log("Disconnected from PostgreSQL");
  }
};

void seedAdmin();
