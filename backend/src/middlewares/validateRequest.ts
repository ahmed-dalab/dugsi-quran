import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { AppError } from "../shared/errors/AppError";

export const validateRequest =
  (schema: z.ZodType<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return next(new AppError(400, "Validation failed", { errors }));
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    if (result.data.params !== undefined) {
      req.params = result.data.params;
    }

    if (result.data.query !== undefined) {
      req.query = result.data.query;
    }

    next();
  };
