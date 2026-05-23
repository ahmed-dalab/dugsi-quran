import { isValidObjectId } from "mongoose";
import type { Request } from "express";
import { ClassModel, type IClass } from "./class.model";
import {
  buildSearchFilter,
  getPaginateOptions,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";

type CreateClassPayload = IClass;
type UpdateClassPayload = Partial<IClass>;

const sanitizeClass = (classItem: unknown) => {
  if (
    typeof classItem === "object" &&
    classItem !== null &&
    "toObject" in classItem &&
    typeof classItem.toObject === "function"
  ) {
    return classItem.toObject() as Record<string, unknown>;
  }

  return classItem as Record<string, unknown>;
};

export const createClassService = async (payload: CreateClassPayload) => {
  const classItem = await ClassModel.create(payload);
  return sanitizeClass(classItem);
};

export const getClassesService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "levelOrder", sortOrder: "asc" });
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(pagination.search, ["name"]),
  };

  if (query.isActive === "true") {
    filter.isActive = true;
  } else if (query.isActive === "false") {
    filter.isActive = false;
  }

  const result = await ClassModel.paginate(filter, getPaginateOptions(pagination));

  return toPaginatedList(result, sanitizeClass);
};

export const getClassByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findById(id).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};

export const updateClassService = async (id: string, payload: UpdateClassPayload) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};

export const deleteClassService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findByIdAndDelete(id).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};
