import jwt from "jsonwebtoken";
import { Prisma } from "../../../generated/prisma";
import { env } from "../../config/env";
import { AppError } from "./AppError";

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    if (env.NODE_ENV === "development") {
      console.error("[Prisma validation error]", error.message);
    }

    return new AppError(400, "Invalid data provided", {
      errors:
        env.NODE_ENV === "development"
          ? [{ field: "request", message: error.message }]
          : undefined,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (env.NODE_ENV === "development") {
      console.error("[Prisma request error]", {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
    }

    if (error.code === "P2002") {
      return new AppError(409, "Duplicate value already exists");
    }

    if (error.code === "P2025") {
      return new AppError(404, "Resource not found");
    }

    if (error.code === "P2003") {
      return new AppError(400, "Invalid reference to related resource");
    }
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    return new AppError(401, "Invalid or expired token");
  }

  if (error instanceof Error) {
    return new AppError(500, error.message, { isOperational: false });
  }

  return new AppError(500, "Something went wrong", { isOperational: false });
}
