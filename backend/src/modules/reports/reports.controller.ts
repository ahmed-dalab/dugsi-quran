import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getReportsOverviewService } from "./reports.service";

export const getReportsOverview = asyncHandler(async (_req: Request, res: Response) => {
  const report = await getReportsOverviewService();

  res.status(200).json({
    message: "Reports overview retrieved successfully",
    data: report,
  });
});
