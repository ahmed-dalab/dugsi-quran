import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { respondOk } from "../../utils/respond";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getDashboardStatsService();
  respondOk(res, "Dashboard statistics retrieved successfully", stats);
});
