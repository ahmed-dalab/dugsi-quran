import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "./user.controller";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from "./user.validations";

const userRouter = Router();

userRouter.post("/", validateRequest(createUserSchema), createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", validateRequest(userParamsSchema), getUser);
userRouter.put("/:id", validateRequest(updateUserSchema), updateUser);
userRouter.delete("/:id", validateRequest(userParamsSchema), deleteUser);
userRouter.patch("/:id/toggle-status", validateRequest(userParamsSchema), toggleUserStatus);

export default userRouter;
