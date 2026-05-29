import { Router } from "express";
import {
  getAttendanceByClassAndDate,
  getAttendanceHistoryByClass,
  getAttendanceList,
  takeAttendance,
} from "./attendance.controller";

const attendanceRouter = Router();

attendanceRouter.post("/", takeAttendance);
attendanceRouter.get("/", getAttendanceList);
attendanceRouter.get("/class/:classId", getAttendanceByClassAndDate);
attendanceRouter.get("/class/:classId/history", getAttendanceHistoryByClass);

export default attendanceRouter;
