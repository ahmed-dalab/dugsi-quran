import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id format");

export const feeParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createFeeSchema = z.object({
  body: z.object({
    studentId: objectIdSchema,
    classId: objectIdSchema,
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
    amountDue: z.number().min(0),
    amountPaid: z.number().min(0).default(0),
    paymentDate: z.coerce.date().nullable().optional(),
    note: z.string().max(500).nullable().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateFeeSchema = z.object({
  body: z
    .object({
      month: z.number().int().min(1).max(12).optional(),
      year: z.number().int().min(2000).optional(),
      amountDue: z.number().min(0).optional(),
      amountPaid: z.number().min(0).optional(),
      paymentDate: z.coerce.date().nullable().optional(),
      note: z.string().max(500).nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: objectIdSchema,
  }),
  query: z.object({}).optional(),
});
