import { isValidObjectId } from "mongoose";
import type { Request } from "express";
import { StudentModel, type IStudent } from "./student.model";
import {
  buildSearchFilter,
  getPaginateOptions,
  getQueryString,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";

type CreateStudentPayload = IStudent;
type UpdateStudentPayload = Partial<IStudent>;

const sanitizeStudent = (student: unknown) => {
  if (
    typeof student === "object" &&
    student !== null &&
    "toObject" in student &&
    typeof student.toObject === "function"
  ) {
    return student.toObject() as Record<string, unknown>;
  }

  return student as Record<string, unknown>;
};

export const createStudentService = async (payload: CreateStudentPayload) => {
  const student = await StudentModel.create(payload);
  return sanitizeStudent(student);
};

export const getStudentsService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(pagination.search, ["fullName", "guardianName", "guardianPhone"]),
  };

  const classId = getQueryString(query, "classId");
  if (classId && isValidObjectId(classId)) {
    filter.classId = classId;
  }

  const status = getQueryString(query, "status");
  if (status === "active" || status === "inactive") {
    filter.status = status;
  }

  const gender = getQueryString(query, "gender");
  if (gender === "male" || gender === "female") {
    filter.gender = gender;
  }

  const result = await StudentModel.paginate(
    filter,
    getPaginateOptions(pagination, {
      populate: { path: "classId", select: "_id name levelOrder" },
    })
  );

  return toPaginatedList(result, sanitizeStudent);
};

export const getStudentByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const student = await StudentModel.findById(id)
    .populate("classId", "_id name levelOrder")
    .lean();

  if (!student) {
    return null;
  }

  return sanitizeStudent(student);
};

export const updateStudentService = async (
  id: string,
  payload: UpdateStudentPayload
) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const student = await StudentModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("classId", "_id name levelOrder")
    .lean();

  if (!student) {
    return null;
  }

  return sanitizeStudent(student);
};

export const deleteStudentService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const student = await StudentModel.findByIdAndDelete(id).lean();

  if (!student) {
    return null;
  }

  return sanitizeStudent(student);
};
