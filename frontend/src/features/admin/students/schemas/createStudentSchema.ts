import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().min(7, "Guardian phone must be at least 7 characters"),
  classId: z.string().min(1, "Class is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
  status: z.enum(["active", "inactive"]),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
