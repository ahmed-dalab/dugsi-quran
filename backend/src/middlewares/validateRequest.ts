import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { AppError } from "../shared/errors/AppError";

const applyValidatedRecord = (
  target: Record<string, unknown>,
  source: Record<string, unknown> | undefined
) => {
  if (!source || Object.keys(source).length === 0) {
    return;
  }

  Object.assign(target, source);
};

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

    applyValidatedRecord(req.params as Record<string, unknown>, result.data.params);
    applyValidatedRecord(req.query as Record<string, unknown>, result.data.query);

    next();
  };
