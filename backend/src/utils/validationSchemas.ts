import { z } from "zod";
import { uuidSchema } from "./id";

export const paramsIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const atLeastOneFieldRefine = {
  refine: (data: Record<string, unknown>) => Object.keys(data).length > 0,
  message: "At least one field is required",
};

export const nullableTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null));

export const createBodySchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    body: z.object(shape),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
  });

export const updateBodySchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    body: z
      .object(shape)
      .refine(atLeastOneFieldRefine.refine, { message: atLeastOneFieldRefine.message }),
    params: z.object({
      id: uuidSchema,
    }),
    query: z.object({}).optional(),
  });

export const paramsUuidSchema = (key: string) =>
  z.object({
    params: z.object({ [key]: uuidSchema }),
    body: z.object({}).optional(),
    query: z.object({}).optional(),
  });

export const dateQuerySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");
