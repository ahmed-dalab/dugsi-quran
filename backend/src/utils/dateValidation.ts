import { z } from "zod";

export const optionalDateSchema = z
  .union([z.coerce.date(), z.literal(""), z.null()])
  .optional()
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  });

export const optionalCoercedDateSchema = z.coerce.date().optional();
