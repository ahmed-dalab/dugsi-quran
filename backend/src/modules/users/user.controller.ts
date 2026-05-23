import type { Request, Response } from "express";
import { assertFound } from "../../shared/errors/assertFound";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  toggleUserStatusService,
  updateUserService,
} from "./user.service";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUserService(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await getUsersService(req.query);

  res.status(200).json({
    message: "Users retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = assertFound(
    await getUserByIdService(getIdParam(req.params.id)),
    "User not found"
  );

  res.status(200).json({
    message: "User retrieved successfully",
    data: user,
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = assertFound(
    await updateUserService(getIdParam(req.params.id), req.body),
    "User not found"
  );

  res.status(200).json({
    message: "User updated successfully",
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = assertFound(
    await deleteUserService(getIdParam(req.params.id)),
    "User not found"
  );

  res.status(200).json({
    message: "User deleted successfully",
    data: user,
  });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = assertFound(
    await toggleUserStatusService(getIdParam(req.params.id)),
    "User not found"
  );

  res.status(200).json({
    message: "User status updated successfully",
    data: user,
  });
});
