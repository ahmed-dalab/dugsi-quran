import { z } from "zod";
import { optionalCoercedDateSchema, optionalDateSchema } from "../../utils/dateValidation";
import {
  createBodySchema,
  nullableTrimmedString,
  paramsIdSchema,
  updateBodySchema,
} from "../../utils/validationSchemas";

const emergencyContactSchema = z
  .object({
    name: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(50).optional(),
    relationship: z.string().trim().max(100).optional(),
  })
  .optional();

export const teacherParamsSchema = paramsIdSchema;

export const createTeacherSchema = createBodySchema({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: nullableTrimmedString(50),
  address: nullableTrimmedString(500),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: optionalDateSchema,
  hireDate: optionalCoercedDateSchema,
  qualification: z.string().trim().max(200).nullable().optional(),
  specialization: z.string().trim().max(200).nullable().optional(),
  experience: z.string().trim().max(500).nullable().optional(),
  salary: z.number().min(0).nullable().optional(),
  employmentType: z.enum(["full-time", "part-time", "volunteer"]).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  emergencyContact: emergencyContactSchema,
});

export const updateTeacherSchema = updateBodySchema({
  name: z.string().trim().min(2).optional(),
  email: z.email().optional(),
  password: z
    .union([z.literal(""), z.string().min(6, "Password must be at least 6 characters")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  phone: nullableTrimmedString(50),
  address: nullableTrimmedString(500),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: optionalDateSchema,
  hireDate: optionalCoercedDateSchema,
  qualification: z.string().trim().max(200).nullable().optional(),
  specialization: z.string().trim().max(200).nullable().optional(),
  experience: z.string().trim().max(500).nullable().optional(),
  salary: z.number().min(0).nullable().optional(),
  employmentType: z.enum(["full-time", "part-time", "volunteer"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  emergencyContact: emergencyContactSchema,
});
