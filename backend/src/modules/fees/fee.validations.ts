import { z } from "zod";
import { createBodySchema, paramsIdSchema, updateBodySchema } from "../../utils/validationSchemas";
import { uuidSchema } from "../../utils/id";

export const feeParamsSchema = paramsIdSchema;

export const createFeeSchema = createBodySchema({
  studentId: uuidSchema,
  amountPaid: z.number().min(0).default(0),
  paymentDate: z.coerce.date().nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});

export const updateFeeSchema = updateBodySchema({
  amountPaid: z.number().min(0).optional(),
  paymentDate: z.coerce.date().nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});
