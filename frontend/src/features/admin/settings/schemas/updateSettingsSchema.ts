import { z } from "zod";

export const updateSettingsSchema = z.object({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolEmail: z.union([z.email("Enter a valid email"), z.literal("")]),
  schoolPhone: z.union([z.string().min(7, "Phone must be at least 7 characters"), z.literal("")]),
  schoolAddress: z.union([z.string().min(2, "Address must be at least 2 characters"), z.literal("")]),
  timezone: z.string().min(2, "Timezone is required"),
  currency: z.string().length(3, "Currency must be 3 letters"),
  attendanceEditWindowDays: z.number().int().min(0).max(60),
  activeAcademicYear: z.string().min(2, "Academic year is required"),
});

export type UpdateSettingsFormValues = z.infer<typeof updateSettingsSchema>;
