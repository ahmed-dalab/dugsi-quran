import { z } from "zod";
import { uuidSchema } from "../../utils/id";

export const feeParamsSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createFeeSchema = z.object({
  body: z.object({
    studentId: uuidSchema,
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
      amountPaid: z.number().min(0).optional(),
      paymentDate: z.coerce.date().nullable().optional(),
      note: z.string().max(500).nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: uuidSchema,
  }),
  query: z.object({}).optional(),
});
