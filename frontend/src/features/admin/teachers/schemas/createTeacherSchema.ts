import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  hireDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>;
