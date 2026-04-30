import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  employeeId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: z.string().optional(),
  hireDate: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  salary: z.number().min(0, "Salary must be positive").optional(),
  employmentType: z.enum(["full-time", "part-time", "volunteer"]).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
});

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>;
