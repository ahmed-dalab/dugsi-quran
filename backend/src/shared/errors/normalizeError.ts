import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AppError } from "./AppError";

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((issue) => ({
      field: issue.path,
      message: issue.message,
    }));

    return new AppError(400, "Validation failed", { errors });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new AppError(400, "Invalid resource id");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return new AppError(409, "Duplicate value already exists");
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    return new AppError(401, "Invalid or expired token");
  }

  if (error instanceof Error) {
    return new AppError(500, error.message, { isOperational: false });
  }

  return new AppError(500, "Something went wrong", { isOperational: false });
}
