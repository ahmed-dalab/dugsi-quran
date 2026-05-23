import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getDashboardStatsService();

  res.status(200).json({
    message: "Dashboard statistics retrieved successfully",
    data: stats,
  });
});
