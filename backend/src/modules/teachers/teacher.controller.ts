import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondPaginated, respondResource } from "../../utils/respond";
import {
  createTeacherService,
  deleteTeacherService,
  getTeacherByIdService,
  getTeachersService,
  updateTeacherService,
} from "./teacher.service";

export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await createTeacherService(req.body);
  respondCreated(res, "Teacher created successfully", teacher);
});

export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const result = await getTeachersService(req.query);
  respondPaginated(res, "Teachers retrieved successfully", result);
});

export const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Teacher retrieved successfully",
    notFoundMessage: "Teacher not found",
    fetch: () => getTeacherByIdService(getIdParam(req.params.id)),
  });
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Teacher updated successfully",
    notFoundMessage: "Teacher not found",
    fetch: () => updateTeacherService(getIdParam(req.params.id), req.body),
  });
});

export const deleteTeacher = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Teacher deleted successfully",
    notFoundMessage: "Teacher not found",
    fetch: () => deleteTeacherService(getIdParam(req.params.id)),
  });
});
