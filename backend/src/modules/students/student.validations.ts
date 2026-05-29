import { z } from "zod";
import { optionalDateSchema } from "../../utils/dateValidation";
import { uuidSchema } from "../../utils/id";

export const studentParamsSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createStudentSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    gender: z.enum(["male", "female"]),
    dateOfBirth: optionalDateSchema,
    guardianName: z
      .string()
      .trim()
      .max(200)
      .nullable()
      .optional()
      .transform((value) => (value?.trim() ? value.trim() : null)),
    guardianPhone: z.string().trim().min(7, "Guardian phone must be at least 7 characters"),
    classId: uuidSchema,
    registrationDate: z.coerce.date(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateStudentSchema = z.object({
  body: z
    .object({
      fullName: z.string().trim().min(2).optional(),
      gender: z.enum(["male", "female"]).optional(),
      dateOfBirth: optionalDateSchema,
      guardianName: z
        .string()
        .trim()
        .max(200)
        .nullable()
        .optional()
        .transform((value) => (value?.trim() ? value.trim() : null)),
      guardianPhone: z.string().trim().min(7).optional(),
      classId: uuidSchema.optional(),
      registrationDate: z.coerce.date().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: uuidSchema,
  }),
  query: z.object({}).optional(),
});
