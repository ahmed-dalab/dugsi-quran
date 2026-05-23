import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getSettingsService, updateSettingsService } from "./settings.service";

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getSettingsService();

  res.status(200).json({
    message: "Settings retrieved successfully",
    data: settings,
  });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await updateSettingsService(req.body);

  res.status(200).json({
    message: "Settings updated successfully",
    data: settings,
  });
});
