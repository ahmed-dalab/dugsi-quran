import type { Response } from "express";
import { assertFound } from "../shared/errors/assertFound";
import type { PaginatedListResult } from "./pagination";

export const respondCreated = (res: Response, message: string, data: unknown) => {
  res.status(201).json({ message, data });
};

export const respondOk = (res: Response, message: string, data: unknown) => {
  res.status(200).json({ message, data });
};

export const respondPaginated = <T>(
  res: Response,
  message: string,
  result: PaginatedListResult<T>
) => {
  res.status(200).json({
    message,
    data: result.data,
    pagination: result.pagination,
  });
};

export const respondResource = async <T>(
  res: Response,
  options: {
    message: string;
    notFoundMessage: string;
    fetch: () => Promise<T | null>;
  }
) => {
  const data = assertFound(await options.fetch(), options.notFoundMessage);
  respondOk(res, options.message, data);
};
