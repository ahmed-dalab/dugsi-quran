import type { PaginationParams } from "@/types/pagination";

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const LIST_ALL_PARAMS: PaginationParams = {
  page: 1,
  limit: MAX_PAGE_SIZE,
};

export type ListQueryParams = PaginationParams &
  Record<string, string | number | boolean | undefined>;

export function toListQueryParams(params?: ListQueryParams) {
  const result: Record<string, string> = {};

  if (!params) {
    return result;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      result[key] = String(value);
    }
  });

  return result;
}
