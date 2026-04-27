import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "./user.service";

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
    return "A user with this email already exists";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

// create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

// get users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersService();

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

// get user
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(getIdParam(req.params.id));

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

// update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await updateUserService(getIdParam(req.params.id), req.body);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: getErrorMessage(error),
    });
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await deleteUserService(getIdParam(req.params.id));

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};
