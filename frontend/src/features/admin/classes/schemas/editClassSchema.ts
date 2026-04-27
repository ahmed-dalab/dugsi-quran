import { z } from "zod";

export const editClassSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  levelOrder: z.number().int().min(1, "Level order must be at least 1"),
  monthlyFee: z.number().min(0, "Monthly fee cannot be negative"),
  teacherId: z.string().optional(),
  isActive: z.boolean(),
});

export type EditClassFormValues = z.infer<typeof editClassSchema>;
