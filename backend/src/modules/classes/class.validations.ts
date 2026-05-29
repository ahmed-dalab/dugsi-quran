import { z } from "zod";
import { uuidSchema } from "../../utils/id";
import {
  createBodySchema,
  nullableTrimmedString,
  paramsIdSchema,
  updateBodySchema,
} from "../../utils/validationSchemas";

const optionalTeacherIdSchema = z
  .union([uuidSchema, z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

export const classParamsSchema = paramsIdSchema;

export const createClassSchema = createBodySchema({
  name: z.string().trim().min(2, "Class name must be at least 2 characters"),
  levelOrder: z.number().int().min(1),
  monthlyFee: z.number().min(0).default(0),
  teacherId: optionalTeacherIdSchema,
  isActive: z.boolean().default(true),
});

export const updateClassSchema = updateBodySchema({
  name: z.string().trim().min(2).optional(),
  levelOrder: z.number().int().min(1).optional(),
  monthlyFee: z.number().min(0).optional(),
  teacherId: optionalTeacherIdSchema,
  isActive: z.boolean().optional(),
});
