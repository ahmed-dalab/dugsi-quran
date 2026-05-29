import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { respondOk } from "../../utils/respond";
import { getReportsOverviewService } from "./reports.service";

export const getReportsOverview = asyncHandler(async (_req: Request, res: Response) => {
  const report = await getReportsOverviewService();
  respondOk(res, "Reports overview retrieved successfully", report);
});
