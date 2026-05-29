import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getIdParam } from "../../utils/getIdParam";
import { respondCreated, respondOk, respondPaginated, respondResource } from "../../utils/respond";
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
  respondCreated(res, "User created successfully", user);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await getUsersService(req.query);
  respondPaginated(res, "Users retrieved successfully", result);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "User retrieved successfully",
    notFoundMessage: "User not found",
    fetch: () => getUserByIdService(getIdParam(req.params.id)),
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "User updated successfully",
    notFoundMessage: "User not found",
    fetch: () => updateUserService(getIdParam(req.params.id), req.body),
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "User deleted successfully",
    notFoundMessage: "User not found",
    fetch: () => deleteUserService(getIdParam(req.params.id)),
  });
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  await respondResource(res, {
    message: "User status updated successfully",
    notFoundMessage: "User not found",
    fetch: () => toggleUserStatusService(getIdParam(req.params.id)),
  });
});
