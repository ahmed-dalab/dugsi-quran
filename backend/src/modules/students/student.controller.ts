import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondPaginated, respondResource } from "../../utils/respond";
import {
  createStudentService,
  deleteStudentService,
  getStudentByIdService,
  getStudentsService,
  updateStudentService,
} from "./student.service";

export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await createStudentService(req.body);
  respondCreated(res, "Student created successfully", student);
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const result = await getStudentsService(req.query);
  respondPaginated(res, "Students retrieved successfully", result);
});

export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Student retrieved successfully",
    notFoundMessage: "Student not found",
    fetch: () => getStudentByIdService(getIdParam(req.params.id)),
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Student updated successfully",
    notFoundMessage: "Student not found",
    fetch: () => updateStudentService(getIdParam(req.params.id), req.body),
  });
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Student deleted successfully",
    notFoundMessage: "Student not found",
    fetch: () => deleteStudentService(getIdParam(req.params.id)),
  });
});
