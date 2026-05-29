import { z } from "zod";

export const editFeeSchema = z.object({
  amountPaid: z.number().min(0, "Amount paid cannot be negative"),
  paymentDate: z.string().optional(),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export type EditFeeFormValues = z.infer<typeof editFeeSchema>;
