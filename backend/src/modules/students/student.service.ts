import type { Request } from "express";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { mapStudentRecord } from "../../utils/mappers";
import type { IStudent } from "./student.model";
import { studentRepository } from "./student.repository";

type CreateStudentPayload = IStudent;
type UpdateStudentPayload = Partial<IStudent>;

export const createStudentService = async (payload: CreateStudentPayload) => {
  const { classId, ...rest } = payload;
  const student = await studentRepository.create({
    ...rest,
    class: { connect: { id: classId } },
  });
  return mapStudentRecord(student);
};

export const getStudentsService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const classId = getQueryString(query, "classId");
  const status = getQueryString(query, "status");
  const gender = getQueryString(query, "gender");

  const result = await studentRepository.findPaginated(pagination, {
    classId: classId && isValidId(classId) ? classId : undefined,
    status: status === "active" || status === "inactive" ? status : undefined,
    gender: gender === "male" || gender === "female" ? gender : undefined,
  });

  return {
    data: result.docs.map(mapStudentRecord),
    pagination: result.pagination,
  };
};

export const getStudentByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const student = await studentRepository.findById(id);
  return student ? mapStudentRecord(student) : null;
};

export const updateStudentService = async (id: string, payload: UpdateStudentPayload) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const student = await studentRepository.update(id, payload);
    return mapStudentRecord(student);
  } catch {
    return null;
  }
};

export const deleteStudentService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const student = await studentRepository.delete(id);
    return mapStudentRecord(student);
  } catch {
    return null;
  }
};
