import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../modules/users/user.model";
import { userRepository } from "../modules/users/user.repository";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;

  const user = await userRepository.findById(String(decoded.sub));
  if (!user) {
    throw new AppError(401, "User not found");
  }

  req.user = {
    id: user.id,
    role: user.role,
  };

  next();
});

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden: You don't have permission to access this resource");
    }

    next();
  };
