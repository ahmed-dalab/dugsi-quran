import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondPaginated, respondResource } from "../../utils/respond";
import {
  getAttendanceByClassAndDateService,
  getAttendanceHistoryByClassService,
  getAttendanceListService,
  takeAttendanceService,
} from "./attendance.service";

export const takeAttendance = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await takeAttendanceService({
    ...req.body,
    takenBy: req.user?.id ?? "",
  });
  respondCreated(res, "Attendance saved successfully", attendance);
});

export const getAttendanceList = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAttendanceListService(req.query);
  respondPaginated(res, "Attendance records retrieved successfully", result);
});

export const getAttendanceByClassAndDate = asyncHandler(async (req: Request, res: Response) => {
  const classId = getIdParam(req.params.classId);
  const date = typeof req.query.date === "string" ? req.query.date : "";

  await respondResource(res, {
    message: "Attendance retrieved successfully",
    notFoundMessage: "Attendance not found for this class and date",
    fetch: () => getAttendanceByClassAndDateService(classId, date),
  });
});

export const getAttendanceHistoryByClass = asyncHandler(async (req: Request, res: Response) => {
  const classId = getIdParam(req.params.classId);
  const result = await getAttendanceHistoryByClassService(classId, req.query);
  respondPaginated(res, "Attendance history retrieved successfully", result);
});
