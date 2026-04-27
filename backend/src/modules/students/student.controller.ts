import type { Request, Response } from "express";
import {
  createStudentService,
  deleteStudentService,
  getStudentByIdService,
  getStudentsService,
  updateStudentService,
} from "./student.service";

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

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await createStudentService(req.body);

    res.status(201).json({
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await getStudentsService();

    res.status(200).json({
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await getStudentByIdService(getIdParam(req.params.id));

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await updateStudentService(getIdParam(req.params.id), req.body);

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await deleteStudentService(getIdParam(req.params.id));

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
