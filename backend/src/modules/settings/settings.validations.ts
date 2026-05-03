import { z } from "zod";

export const updateSettingsSchema = z.object({
  body: z.object({
    schoolName: z.string().min(2).optional(),
    schoolEmail: z.email("Enter a valid email").nullable().optional(),
    schoolPhone: z.string().min(7).max(30).nullable().optional(),
    schoolAddress: z.string().min(2).max(200).nullable().optional(),
    timezone: z.string().min(2).max(100).optional(),
    currency: z.string().length(3).optional(),
    attendanceEditWindowDays: z.number().int().min(0).max(60).optional(),
    activeAcademicYear: z.string().min(2).max(30).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
