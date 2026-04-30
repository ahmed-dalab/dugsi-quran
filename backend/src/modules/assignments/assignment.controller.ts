import type { Request, Response } from "express";
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

const getIdParam = (id: string | string[] | undefined) => {
  if (Array.isArray(id)) {
    return id[0];
  }

  return id ?? "";
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    // Add the current admin user as the assignedBy
    const payload = {
      ...req.body,
      assignedBy: (req as any).user.id,
    };

    const assignment = await createAssignmentService(payload);

    res.status(201).json({
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const assignments = await getAssignmentsService(status as string);

    res.status(200).json({
      message: "Assignments retrieved successfully",
      data: assignments,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await getAssignmentByIdService(getIdParam(req.params.id));

    if (!assignment) {
      res.status(404).json({
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Assignment retrieved successfully",
      data: assignment,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAssignmentsByTeacher = async (req: Request, res: Response) => {
  try {
    const assignments = await getAssignmentsByTeacherService(getIdParam(req.params.teacherId));

    res.status(200).json({
      message: "Teacher assignments retrieved successfully",
      data: assignments,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getAssignmentsByClass = async (req: Request, res: Response) => {
  try {
    const assignments = await getAssignmentsByClassService(getIdParam(req.params.classId));

    res.status(200).json({
      message: "Class assignments retrieved successfully",
      data: assignments,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getCurrentAssignmentForTeacher = async (req: Request, res: Response) => {
  try {
    const assignment = await getCurrentAssignmentForTeacherService(getIdParam(req.params.teacherId));

    if (!assignment) {
      res.status(200).json({
        message: "No active assignment found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      message: "Current assignment retrieved successfully",
      data: assignment,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await updateAssignmentService(getIdParam(req.params.id), req.body);

    if (!assignment) {
      res.status(404).json({
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await deleteAssignmentService(getIdParam(req.params.id));

    if (!assignment) {
      res.status(404).json({
        message: "Assignment not found",
      });
      return;
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
      data: assignment,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
