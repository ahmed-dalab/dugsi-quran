import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondPaginated, respondResource } from "../../utils/respond";
import {
  createFeeService,
  deleteFeeService,
  getFeeByIdService,
  getFeesService,
  updateFeeService,
} from "./fee.service";

export const createFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = await createFeeService(req.body, req.user?.id);
  respondCreated(res, "Fee payment created successfully", fee);
});

export const getFees = asyncHandler(async (req: Request, res: Response) => {
  const result = await getFeesService(req.query);
  respondPaginated(res, "Fee payments retrieved successfully", result);
});

export const getFee = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Fee payment retrieved successfully",
    notFoundMessage: "Fee payment not found",
    fetch: () => getFeeByIdService(getIdParam(req.params.id)),
  });
});

export const updateFee = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Fee payment updated successfully",
    notFoundMessage: "Fee payment not found",
    fetch: () => updateFeeService(getIdParam(req.params.id), req.body),
  });
});

export const deleteFee = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Fee payment deleted successfully",
    notFoundMessage: "Fee payment not found",
    fetch: () => deleteFeeService(getIdParam(req.params.id)),
  });
});
