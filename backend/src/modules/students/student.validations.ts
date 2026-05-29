import { z } from "zod";
import { optionalDateSchema } from "../../utils/dateValidation";
import { uuidSchema } from "../../utils/id";
import {
  createBodySchema,
  nullableTrimmedString,
  paramsIdSchema,
  updateBodySchema,
} from "../../utils/validationSchemas";

export const studentParamsSchema = paramsIdSchema;

export const createStudentSchema = createBodySchema({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: optionalDateSchema,
  guardianName: nullableTrimmedString(200),
  guardianPhone: z.string().trim().min(7, "Guardian phone must be at least 7 characters"),
  classId: uuidSchema,
  registrationDate: z.coerce.date(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateStudentSchema = updateBodySchema({
  fullName: z.string().trim().min(2).optional(),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: optionalDateSchema,
  guardianName: nullableTrimmedString(200),
  guardianPhone: z.string().trim().min(7).optional(),
  classId: uuidSchema.optional(),
  registrationDate: z.coerce.date().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
