import type { Request, Response, NextFunction } from "express";
import * as z from "zod";

export const validateRequest =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
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

      return res.status(400).json({
        status: "failed",
        errors,
      });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();
  };