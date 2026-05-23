import type { Request } from "express";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedListResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function parsePaginationQuery(
  query: Request["query"],
  defaults?: { sortBy?: string; sortOrder?: "asc" | "desc" }
): PaginationQuery {
  const page = Math.max(1, Number.parseInt(String(query.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const rawLimit = Number.parseInt(String(query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
  const search = typeof query.search === "string" && query.search.trim() ? query.search.trim() : undefined;
  const sortBy = typeof query.sortBy === "string" && query.sortBy.trim() ? query.sortBy.trim() : defaults?.sortBy;
  const sortOrder =
    query.sortOrder === "asc" ? "asc" : query.sortOrder === "desc" ? "desc" : (defaults?.sortOrder ?? "desc");

  return { page, limit, search, sortBy, sortOrder };
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getQueryString(query: Request["query"], key: string) {
  const value = query[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function emptyPaginatedList<T = unknown>(): PaginatedListResult<T> {
  return {
    data: [],
    pagination: {
      totalDocs: 0,
      limit: DEFAULT_LIMIT,
      page: DEFAULT_PAGE,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    },
  };
}
