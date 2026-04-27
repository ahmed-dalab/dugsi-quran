// src/features/users/schemas/createUserSchema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher"]),
  isActive: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;