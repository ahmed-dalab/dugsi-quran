import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondPaginated, respondResource } from "../../utils/respond";
import {
  createClassService,
  deleteClassService,
  getClassByIdService,
  getClassesService,
  updateClassService,
} from "./class.service";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const classItem = await createClassService(req.body);
  respondCreated(res, "Class created successfully", classItem);
});

export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const result = await getClassesService(req.query);
  respondPaginated(res, "Classes retrieved successfully", result);
});

export const getClass = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Class retrieved successfully",
    notFoundMessage: "Class not found",
    fetch: () => getClassByIdService(getIdParam(req.params.id)),
  });
});

export const updateClass = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Class updated successfully",
    notFoundMessage: "Class not found",
    fetch: () => updateClassService(getIdParam(req.params.id), req.body),
  });
});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Class deleted successfully",
    notFoundMessage: "Class not found",
    fetch: () => deleteClassService(getIdParam(req.params.id)),
  });
});
