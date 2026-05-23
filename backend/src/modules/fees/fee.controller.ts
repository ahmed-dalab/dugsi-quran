import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createFeeService,
  deleteFeeService,
  getFeeByIdService,
  getFeesService,
  updateFeeService,
} from "./fee.service";

export const createFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = assertFound(await createFeeService(req.body, req.user?.id), "Fee payment not found");

  res.status(201).json({
    message: "Fee payment created successfully",
    data: fee,
  });
});

export const getFees = asyncHandler(async (req: Request, res: Response) => {
  const result = await getFeesService(req.query);

  res.status(200).json({
    message: "Fee payments retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = assertFound(
    await getFeeByIdService(getIdParam(req.params.id)),
    "Fee payment not found"
  );

  res.status(200).json({
    message: "Fee payment retrieved successfully",
    data: fee,
  });
});

export const updateFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = assertFound(
    await updateFeeService(getIdParam(req.params.id), req.body),
    "Fee payment not found"
  );

  res.status(200).json({
    message: "Fee payment updated successfully",
    data: fee,
  });
});

export const deleteFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = assertFound(
    await deleteFeeService(getIdParam(req.params.id)),
    "Fee payment not found"
  );

  res.status(200).json({
    message: "Fee payment deleted successfully",
    data: fee,
  });
});
