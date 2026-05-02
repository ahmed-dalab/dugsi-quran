import type { Request, Response } from "express";
import {
  getAttendanceByClassAndDateService,
  getAttendanceHistoryByClassService,
  takeAttendanceService,
} from "./attendance.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

const getUserIdFromRequest = (req: Request): string => req.user?.id ?? "";
const getParamValue = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : (value ?? "");

export const takeAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await takeAttendanceService({
      ...req.body,
      takenBy: getUserIdFromRequest(req),
    });

    res.status(201).json({
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAttendanceByClassAndDate = async (req: Request, res: Response) => {
  try {
    const classId = getParamValue(req.params.classId);
    const date = typeof req.query.date === "string" ? req.query.date : "";

    if (!date) {
      res.status(400).json({
        message: "Query param 'date' is required (YYYY-MM-DD)",
      });
      return;
    }

    const attendance = await getAttendanceByClassAndDateService(classId, date);

    if (!attendance) {
      res.status(404).json({
        message: "Attendance not found for this class and date",
      });
      return;
    }

    res.status(200).json({
      message: "Attendance retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAttendanceHistoryByClass = async (req: Request, res: Response) => {
  try {
    const classId = getParamValue(req.params.classId);
    const history = await getAttendanceHistoryByClassService(classId);

    res.status(200).json({
      message: "Attendance history retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
