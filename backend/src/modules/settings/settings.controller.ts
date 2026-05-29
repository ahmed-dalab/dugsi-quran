import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { respondOk } from "../../utils/respond";
import { getSettingsService, updateSettingsService } from "./settings.service";

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getSettingsService();
  respondOk(res, "Settings retrieved successfully", settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await updateSettingsService(req.body);
  respondOk(res, "Settings updated successfully", settings);
});
