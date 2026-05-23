import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createTeacherService,
  deleteTeacherService,
  getTeacherByIdService,
  getTeachersService,
  updateTeacherService,
} from "./teacher.service";

export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await createTeacherService(req.body);

  res.status(201).json({
    message: "Teacher created successfully",
    data: teacher,
  });
});

export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const result = await getTeachersService(req.query);

  res.status(200).json({
    message: "Teachers retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = assertFound(
    await getTeacherByIdService(getIdParam(req.params.id)),
    "Teacher not found"
  );

  res.status(200).json({
    message: "Teacher retrieved successfully",
    data: teacher,
  });
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = assertFound(
    await updateTeacherService(getIdParam(req.params.id), req.body),
    "Teacher not found"
  );

  res.status(200).json({
    message: "Teacher updated successfully",
    data: teacher,
  });
});

export const deleteTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = assertFound(
    await deleteTeacherService(getIdParam(req.params.id)),
    "Teacher not found"
  );

  res.status(200).json({
    message: "Teacher deleted successfully",
    data: teacher,
  });
});
