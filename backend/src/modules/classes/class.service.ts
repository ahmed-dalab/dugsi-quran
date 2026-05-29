import type { Request } from "express";
import { parsePaginationQuery } from "../../utils/pagination";
import { parseBooleanQuery } from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult, mutateOrNull } from "../../utils/serviceHelpers";
import { serializeEntity } from "../../utils/serialize";
import type { IClass } from "./class.model";
import { classRepository } from "./class.repository";

type CreateClassPayload = IClass;
type UpdateClassPayload = Partial<IClass>;

export const createClassService = async (payload: CreateClassPayload) => {
  const classItem = await classRepository.create(payload);
  return serializeEntity(classItem);
};

export const getClassesService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "levelOrder", sortOrder: "asc" });
  const result = await classRepository.findPaginated(pagination, {
    isActive: parseBooleanQuery(query, "isActive"),
  });

  return mapPaginatedResult(result, serializeEntity);
};

export const getClassByIdService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const classItem = await classRepository.findById(validId);
    return classItem ? serializeEntity(classItem) : null;
  });

export const updateClassService = (id: string, payload: UpdateClassPayload) =>
  mutateOrNull(id, async (validId) => {
    const classItem = await classRepository.update(validId, payload);
    return serializeEntity(classItem);
  });

export const deleteClassService = (id: string) =>
  mutateOrNull(id, async (validId) => {
    const classItem = await classRepository.delete(validId);
    return serializeEntity(classItem);
  });
