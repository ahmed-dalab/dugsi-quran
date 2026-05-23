import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../shared/errors/AppError";
import { normalizeError } from "../shared/errors/normalizeError";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appError = normalizeError(error);

  if (!appError.isOperational) {
    console.error(error);
  }

  const isDevelopment = env.NODE_ENV === "development";
  const message =
    appError.isOperational || isDevelopment ? appError.message : "Something went wrong";

  res.status(appError.statusCode).json({
    status: "failed",
    message,
    ...(appError.errors ? { errors: appError.errors } : {}),
    ...(isDevelopment && error instanceof Error && !appError.isOperational
      ? { stack: error.stack }
      : {}),
  });
};
