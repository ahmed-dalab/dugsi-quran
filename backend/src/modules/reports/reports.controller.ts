import type { Request, Response } from "express";
import { getReportsOverviewService } from "./reports.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getReportsOverview = async (_req: Request, res: Response) => {
  try {
    const report = await getReportsOverviewService();

    res.status(200).json({
      message: "Reports overview retrieved successfully",
      data: report,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
