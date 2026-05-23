import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { AppError } from "../../shared/errors/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  getAttendanceByClassAndDateService,
  getAttendanceHistoryByClassService,
  takeAttendanceService,
} from "./attendance.service";

export const takeAttendance = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await takeAttendanceService({
    ...req.body,
    takenBy: req.user?.id ?? "",
  });

  res.status(201).json({
    message: "Attendance saved successfully",
    data: attendance,
  });
});

export const getAttendanceByClassAndDate = asyncHandler(async (req: Request, res: Response) => {
  const classId = getIdParam(req.params.classId);
  const date = typeof req.query.date === "string" ? req.query.date : "";

  if (!date) {
    throw new AppError(400, "Query param 'date' is required (YYYY-MM-DD)");
  }

  const attendance = assertFound(
    await getAttendanceByClassAndDateService(classId, date),
    "Attendance not found for this class and date"
  );

  res.status(200).json({
    message: "Attendance retrieved successfully",
    data: attendance,
  });
});

export const getAttendanceHistoryByClass = asyncHandler(async (req: Request, res: Response) => {
  const classId = getIdParam(req.params.classId);
  const result = await getAttendanceHistoryByClassService(classId, req.query);

  res.status(200).json({
    message: "Attendance history retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});
