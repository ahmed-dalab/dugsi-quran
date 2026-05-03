import type { Request, Response } from "express";
import {
  createFeeService,
  deleteFeeService,
  getFeeByIdService,
  getFeesService,
  updateFeeService,
} from "./fee.service";

const getIdParam = (id: string | string[] | undefined) => {
  if (Array.isArray(id)) {
    return id[0];
  }

  return id ?? "";
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const createFee = async (req: Request, res: Response) => {
  try {
    const fee = await createFeeService(req.body, req.user?.id);

    res.status(201).json({
      message: "Fee payment created successfully",
      data: fee,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getFees = async (_req: Request, res: Response) => {
  try {
    const fees = await getFeesService();

    res.status(200).json({
      message: "Fee payments retrieved successfully",
      data: fees,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getFee = async (req: Request, res: Response) => {
  try {
    const fee = await getFeeByIdService(getIdParam(req.params.id));

    if (!fee) {
      res.status(404).json({
        message: "Fee payment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Fee payment retrieved successfully",
      data: fee,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateFee = async (req: Request, res: Response) => {
  try {
    const fee = await updateFeeService(getIdParam(req.params.id), req.body);

    if (!fee) {
      res.status(404).json({
        message: "Fee payment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Fee payment updated successfully",
      data: fee,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const deleteFee = async (req: Request, res: Response) => {
  try {
    const fee = await deleteFeeService(getIdParam(req.params.id));

    if (!fee) {
      res.status(404).json({
        message: "Fee payment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Fee payment deleted successfully",
      data: fee,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
