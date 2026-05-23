import { z } from "zod";

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidId = (id: string) => UUID_REGEX.test(id);

export const uuidSchema = z.string().regex(UUID_REGEX, "Invalid id format");
