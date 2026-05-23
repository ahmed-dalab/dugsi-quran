import type { PaginateOptions, PaginateResult } from "mongoose";
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

export function buildSearchFilter(search: string | undefined, fields: string[]) {
  if (!search || fields.length === 0) {
    return {};
  }

  const regex = new RegExp(escapeRegex(search), "i");

  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
}

export function buildSortOption(sortBy: string | undefined, sortOrder: "asc" | "desc", fallback = "createdAt") {
  const field = sortBy || fallback;
  return { [field]: sortOrder === "asc" ? 1 : -1 } as Record<string, 1 | -1>;
}

export function getPaginateOptions(
  pagination: PaginationQuery,
  options: Partial<PaginateOptions> = {}
): PaginateOptions {
  const { sort: customSort, ...rest } = options;

  return {
    page: pagination.page,
    limit: pagination.limit,
    sort: customSort ?? buildSortOption(pagination.sortBy, pagination.sortOrder),
    lean: true,
    ...rest,
  };
}

export function formatPaginationMeta<T>(result: PaginateResult<T>): PaginationMeta {
  return {
    totalDocs: result.totalDocs,
    limit: result.limit,
    page: result.page ?? 1,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
    nextPage: result.nextPage ?? null,
    prevPage: result.prevPage ?? null,
  };
}

export function toPaginatedList<T>(
  result: PaginateResult<T>,
  mapDoc: (doc: T) => unknown
): PaginatedListResult<unknown> {
  return {
    data: result.docs.map(mapDoc),
    pagination: formatPaginationMeta(result),
  };
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
