import { z } from "zod";

export const editTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please provide a valid email"),
  password: z
    .string()
    .refine((value) => value === "" || value.length >= 6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  hireDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type EditTeacherFormValues = z.infer<typeof editTeacherSchema>;
