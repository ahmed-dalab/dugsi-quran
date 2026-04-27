// src/features/users/schemas/editUserSchema.ts
import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Enter a valid email").optional(),
  role: z.enum(["admin", "teacher"]).optional(),
  isActive: z.boolean().optional(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
