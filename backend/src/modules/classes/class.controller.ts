import type { Request, Response } from "express";
import {
  createClassService,
  deleteClassService,
  getClassByIdService,
  getClassesService,
  updateClassService,
} from "./class.service";

const getIdParam = (id: string | string[] | undefined) => {
  if (Array.isArray(id)) {
    return id[0];
  }

  return id ?? "";
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return "A class with this unique value already exists";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const classItem = await createClassService(req.body);

    res.status(201).json({
      message: "Class created successfully",
      data: classItem,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const getClasses = async (_req: Request, res: Response) => {
  try {
    const classes = await getClassesService();

    res.status(200).json({
      message: "Classes retrieved successfully",
      data: classes,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const classItem = await getClassByIdService(getIdParam(req.params.id));

    if (!classItem) {
      res.status(404).json({
        message: "Class not found",
      });
      return;
    }

    res.status(200).json({
      message: "Class retrieved successfully",
      data: classItem,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const classItem = await updateClassService(getIdParam(req.params.id), req.body);

    if (!classItem) {
      res.status(404).json({
        message: "Class not found",
      });
      return;
    }

    res.status(200).json({
      message: "Class updated successfully",
      data: classItem,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classItem = await deleteClassService(getIdParam(req.params.id));

    if (!classItem) {
      res.status(404).json({
        message: "Class not found",
      });
      return;
    }

    res.status(200).json({
      message: "Class deleted successfully",
      data: classItem,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
