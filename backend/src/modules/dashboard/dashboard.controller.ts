import type { Request, Response } from "express";
import { getDashboardStatsService } from "./dashboard.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
