import type { Request } from "express";
import type { PaginationMeta, PaginationQuery } from "./pagination";
import { parsePaginationQuery } from "./pagination";

export const buildPaginationMeta = (
  totalDocs: number,
  pagination: PaginationQuery
): PaginationMeta => {
  const totalPages = Math.ceil(totalDocs / pagination.limit) || 0;
  const page = pagination.page;

  return {
    totalDocs,
    limit: pagination.limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

export const getPrismaPaginationArgs = (pagination: PaginationQuery) => ({
  skip: (pagination.page - 1) * pagination.limit,
  take: pagination.limit,
});

export const parseListQuery = (
  query: Request["query"],
  defaults?: { sortBy?: string; sortOrder?: "asc" | "desc" }
) => parsePaginationQuery(query, defaults);
