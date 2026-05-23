import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createClassService,
  deleteClassService,
  getClassByIdService,
  getClassesService,
  updateClassService,
} from "./class.service";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const classItem = await createClassService(req.body);

  res.status(201).json({
    message: "Class created successfully",
    data: classItem,
  });
});

export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const result = await getClassesService(req.query);

  res.status(200).json({
    message: "Classes retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getClass = asyncHandler(async (req: Request, res: Response) => {
  const classItem = assertFound(
    await getClassByIdService(getIdParam(req.params.id)),
    "Class not found"
  );

  res.status(200).json({
    message: "Class retrieved successfully",
    data: classItem,
  });
});

export const updateClass = asyncHandler(async (req: Request, res: Response) => {
  const classItem = assertFound(
    await updateClassService(getIdParam(req.params.id), req.body),
    "Class not found"
  );

  res.status(200).json({
    message: "Class updated successfully",
    data: classItem,
  });
});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
  const classItem = assertFound(
    await deleteClassService(getIdParam(req.params.id)),
    "Class not found"
  );

  res.status(200).json({
    message: "Class deleted successfully",
    data: classItem,
  });
});
