import type { Request } from "express";
import { isValidId } from "../../utils/id";
import { parsePaginationQuery } from "../../utils/pagination";
import { serializeEntity, serializeList } from "../../utils/serialize";
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
  const filters: { isActive?: boolean } = {};

  if (query.isActive === "true") {
    filters.isActive = true;
  } else if (query.isActive === "false") {
    filters.isActive = false;
  }

  const result = await classRepository.findPaginated(pagination, filters);

  return {
    data: serializeList(result.docs),
    pagination: result.pagination,
  };
};

export const getClassByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const classItem = await classRepository.findById(id);
  return classItem ? serializeEntity(classItem) : null;
};

export const updateClassService = async (id: string, payload: UpdateClassPayload) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const classItem = await classRepository.update(id, payload);
    return serializeEntity(classItem);
  } catch {
    return null;
  }
};

export const deleteClassService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const classItem = await classRepository.delete(id);
    return serializeEntity(classItem);
  } catch {
    return null;
  }
};
