import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondOk, respondPaginated, respondResource } from "../../utils/respond";
import {
  createAssignmentService,
  deleteAssignmentService,
  getAssignmentByIdService,
  getAssignmentsByClassService,
  getAssignmentsByTeacherService,
  getAssignmentsService,
  getCurrentAssignmentForTeacherService,
  updateAssignmentService,
} from "./assignment.service";

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await createAssignmentService({
    ...req.body,
    assignedBy: req.user!.id,
  });
  respondCreated(res, "Assignment created successfully", assignment);
});

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsService(req.query);
  respondPaginated(res, "Assignments retrieved successfully", result);
});

export const getAssignment = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Assignment retrieved successfully",
    notFoundMessage: "Assignment not found",
    fetch: () => getAssignmentByIdService(getIdParam(req.params.id)),
  });
});

export const getAssignmentsByTeacher = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsByTeacherService(
    getIdParam(req.params.teacherId),
    req.query
  );
  respondPaginated(res, "Teacher assignments retrieved successfully", result);
});

export const getAssignmentsByClass = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAssignmentsByClassService(getIdParam(req.params.classId), req.query);
  respondPaginated(res, "Class assignments retrieved successfully", result);
});

export const getCurrentAssignmentForTeacher = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await getCurrentAssignmentForTeacherService(
    getIdParam(req.params.teacherId)
  );

  respondOk(
    res,
    assignment ? "Current assignment retrieved successfully" : "No active assignment found",
    assignment
  );
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Assignment updated successfully",
    notFoundMessage: "Assignment not found",
    fetch: () => updateAssignmentService(getIdParam(req.params.id), req.body),
  });
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "Assignment deleted successfully",
    notFoundMessage: "Assignment not found",
    fetch: () => deleteAssignmentService(getIdParam(req.params.id)),
  });
});
