import type { Request } from "express";
import { isValidId } from "./id";
import { getQueryString } from "./pagination";

export function parseEnumFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[]
): T | undefined {
  if (!value) {
    return undefined;
  }

  return allowed.includes(value as T) ? (value as T) : undefined;
}

export function parseOptionalUuid(value: string | undefined): string | undefined {
  return value && isValidId(value) ? value : undefined;
}

export function parseOptionalUuidQuery(query: Request["query"], key: string) {
  return parseOptionalUuid(getQueryString(query, key));
}

export function parseBooleanQuery(query: Request["query"], key: string): boolean | undefined {
  const value = query[key];

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export function parseBoundedInt(value: unknown, min: number, max?: number): number | undefined {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (Number.isNaN(parsed) || parsed < min) {
    return undefined;
  }

  if (max !== undefined && parsed > max) {
    return undefined;
  }

  return parsed;
}

export function parseMonthFilter(value: unknown) {
  return parseBoundedInt(value, 1, 12);
}

export function parseYearFilter(value: unknown) {
  return parseBoundedInt(value, 2000);
}

export const ACTIVE_INACTIVE = ["active", "inactive"] as const;
export const ASSIGNMENT_STATUSES = ["active", "inactive", "ended"] as const;
export const FEE_STATUSES = ["paid", "partial", "unpaid"] as const;
export const USER_ROLES = ["admin", "teacher"] as const;
export const STUDENT_GENDERS = ["male", "female"] as const;
