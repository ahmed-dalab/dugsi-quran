import { z } from "zod";
import { optionalCoercedDateSchema } from "../../utils/dateValidation";
import { uuidSchema } from "../../utils/id";
import {
  createBodySchema,
  nullableTrimmedString,
  paramsIdSchema,
  paramsUuidSchema,
  updateBodySchema,
} from "../../utils/validationSchemas";

export const assignmentParamsSchema = paramsIdSchema;
export const teacherIdParamsSchema = paramsUuidSchema("teacherId");
export const classIdParamsSchema = paramsUuidSchema("classId");

export const createAssignmentSchema = createBodySchema({
  teacherId: uuidSchema,
  classId: uuidSchema,
  notes: nullableTrimmedString(500),
});

export const updateAssignmentSchema = updateBodySchema({
  status: z.enum(["active", "inactive", "ended"]).optional(),
  endDate: optionalCoercedDateSchema,
  notes: nullableTrimmedString(500),
});
