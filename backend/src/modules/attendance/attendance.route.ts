import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  getAttendanceByClassAndDate,
  getAttendanceHistoryByClass,
  getAttendanceList,
  takeAttendance,
} from "./attendance.controller";
import {
  attendanceByClassDateSchema,
  classIdParamsSchema,
  takeAttendanceSchema,
} from "./attendance.validations";

const attendanceRouter = Router();

attendanceRouter.post("/", validateRequest(takeAttendanceSchema), takeAttendance);
attendanceRouter.get("/", getAttendanceList);
attendanceRouter.get(
  "/class/:classId",
  validateRequest(attendanceByClassDateSchema),
  getAttendanceByClassAndDate
);
attendanceRouter.get(
  "/class/:classId/history",
  validateRequest(classIdParamsSchema),
  getAttendanceHistoryByClass
);

export default attendanceRouter;
