import { z } from "zod";

export const createFeeSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amountPaid: z.number().min(0, "Amount paid cannot be negative"),
  paymentDate: z.string().optional(),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export type CreateFeeFormValues = z.infer<typeof createFeeSchema>;
