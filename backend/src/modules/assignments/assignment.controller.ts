import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createAssignmentService,
  deleteAssignmentService,
  getAssignmentByIdService,
  getAssignmentsByClassService,
  getAssignmentsByTeacherService,
  getAssignmentsService,
  updateAssignmentService,
  getCurrentAssignmentForTeacherService,
} from "./assignment.service";

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await createAssignmentService({
    ...req.body,
    assignedBy: req.user!.id,
  });

  res.status(201).json({
    message: "Assignment created successfully",
    data: assignment,
  });
});

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsService(req.query);

  res.status(200).json({
    message: "Assignments retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = assertFound(
    await getAssignmentByIdService(getIdParam(req.params.id)),
    "Assignment not found"
  );

  res.status(200).json({
    message: "Assignment retrieved successfully",
    data: assignment,
  });
});

export const getAssignmentsByTeacher = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsByTeacherService(
    getIdParam(req.params.teacherId),
    req.query
  );

  res.status(200).json({
    message: "Teacher assignments retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getAssignmentsByClass = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsByClassService(getIdParam(req.params.classId), req.query);

  res.status(200).json({
    message: "Class assignments retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getCurrentAssignmentForTeacher = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await getCurrentAssignmentForTeacherService(
    getIdParam(req.params.teacherId)
  );

  res.status(200).json({
    message: assignment ? "Current assignment retrieved successfully" : "No active assignment found",
    data: assignment,
  });
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = assertFound(
    await updateAssignmentService(getIdParam(req.params.id), req.body),
    "Assignment not found"
  );

  res.status(200).json({
    message: "Assignment updated successfully",
    data: assignment,
  });
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = assertFound(
    await deleteAssignmentService(getIdParam(req.params.id)),
    "Assignment not found"
  );

  res.status(200).json({
    message: "Assignment deleted successfully",
    data: assignment,
  });
});
