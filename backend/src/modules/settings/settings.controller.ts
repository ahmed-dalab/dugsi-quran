import type { Request, Response } from "express";
import { getSettingsService, updateSettingsService } from "./settings.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getSettingsService();

    res.status(200).json({
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await updateSettingsService(req.body);

    res.status(200).json({
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};
