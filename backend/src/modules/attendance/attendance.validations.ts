import { z } from "zod";
import { uuidSchema } from "../../utils/id";
import {
  createBodySchema,
  dateQuerySchema,
  paramsUuidSchema,
} from "../../utils/validationSchemas";

const attendanceRecordSchema = z.object({
  studentId: uuidSchema,
  status: z.enum(["present", "absent", "late", "excused"]),
  note: z.string().trim().max(500).optional(),
});

export const classIdParamsSchema = paramsUuidSchema("classId");

export const takeAttendanceSchema = createBodySchema({
  classId: uuidSchema,
  date: dateQuerySchema,
  records: z.array(attendanceRecordSchema).min(1, "At least one attendance record is required"),
});

export const attendanceByClassDateSchema = z.object({
  params: z.object({
    classId: uuidSchema,
  }),
  query: z.object({
    date: dateQuerySchema,
  }),
  body: z.object({}).optional(),
});
