import { AppError } from "./AppError";

export function assertFound<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new AppError(404, message);
  }

  return value;
}
