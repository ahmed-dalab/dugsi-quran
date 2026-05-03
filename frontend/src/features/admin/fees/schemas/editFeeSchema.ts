import { z } from "zod";

export const editFeeSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  amountDue: z.number().min(0, "Amount due cannot be negative"),
  amountPaid: z.number().min(0, "Amount paid cannot be negative"),
  paymentDate: z.string().optional(),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export type EditFeeFormValues = z.infer<typeof editFeeSchema>;
