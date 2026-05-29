import { z } from "zod";
import {
  createBodySchema,
  paramsIdSchema,
  updateBodySchema,
} from "../../utils/validationSchemas";

export const userParamsSchema = paramsIdSchema;

export const createUserSchema = createBodySchema({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher"]),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = updateBodySchema({
  name: z.string().trim().min(2).optional(),
  email: z.email().optional(),
  role: z.enum(["admin", "teacher"]).optional(),
  isActive: z.boolean().optional(),
});
