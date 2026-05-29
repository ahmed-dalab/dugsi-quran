import { isValidId } from "./id";
import type { PaginationMeta } from "./pagination";

export async function getByIdOrNull<T>(
  id: string,
  fetch: (validId: string) => Promise<T | null>
): Promise<T | null> {
  if (!isValidId(id)) {
    return null;
  }

  return fetch(id);
}

export async function mutateOrNull<T>(
  id: string,
  mutate: (validId: string) => Promise<T>
): Promise<T | null> {
  if (!isValidId(id)) {
    return null;
  }

  try {
    return await mutate(id);
  } catch {
    return null;
  }
}

export function mapPaginatedResult<T, R>(
  result: { docs: T[]; pagination: PaginationMeta },
  mapper: (doc: T) => R
) {
  return {
    data: result.docs.map(mapper),
    pagination: result.pagination,
  };
}
