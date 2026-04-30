import type { Request, Response } from "express";
import {
  createTeacherService,
  deleteTeacherService,
  getTeacherByIdService,
  getTeachersService,
  updateTeacherService,
} from "./teacher.service";

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

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await createTeacherService(req.body);

    res.status(201).json({
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await getTeachersService();

    res.status(200).json({
      message: "Teachers retrieved successfully",
      data: teachers,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await getTeacherByIdService(getIdParam(req.params.id));

    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found",
      });
      return;
    }

    res.status(200).json({
      message: "Teacher retrieved successfully",
      data: teacher,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await updateTeacherService(getIdParam(req.params.id), req.body);

    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found",
      });
      return;
    }

    res.status(200).json({
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await deleteTeacherService(getIdParam(req.params.id));

    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found",
      });
      return;
    }

    res.status(200).json({
      message: "Teacher deleted successfully",
      data: teacher,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
