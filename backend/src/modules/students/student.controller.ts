import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createStudentService,
  deleteStudentService,
  getStudentByIdService,
  getStudentsService,
  updateStudentService,
} from "./student.service";

export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await createStudentService(req.body);

  res.status(201).json({
    message: "Student created successfully",
    data: student,
  });
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const result = await getStudentsService(req.query);

  res.status(200).json({
    message: "Students retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = assertFound(
    await getStudentByIdService(getIdParam(req.params.id)),
    "Student not found"
  );

  res.status(200).json({
    message: "Student retrieved successfully",
    data: student,
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = assertFound(
    await updateStudentService(getIdParam(req.params.id), req.body),
    "Student not found"
  );

  res.status(200).json({
    message: "Student updated successfully",
    data: student,
  });
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = assertFound(
    await deleteStudentService(getIdParam(req.params.id)),
    "Student not found"
  );

  res.status(200).json({
    message: "Student deleted successfully",
    data: student,
  });
});
