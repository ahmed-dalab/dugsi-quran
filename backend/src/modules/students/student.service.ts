import type { Request } from "express";
import type { Prisma } from "../../../generated/prisma";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { mapStudentRecord } from "../../utils/mappers";
import { studentRepository } from "./student.repository";

type CreateStudentPayload = {
  fullName: string;
  gender: "male" | "female";
  dateOfBirth?: Date | null;
  guardianName?: string | null;
  guardianPhone: string;
  classId: string;
  registrationDate: Date;
  status: "active" | "inactive";
};

type UpdateStudentPayload = Partial<CreateStudentPayload>;

const buildCreateInput = (payload: CreateStudentPayload): Prisma.StudentCreateInput => ({
  fullName: payload.fullName,
  gender: payload.gender,
  dateOfBirth: payload.dateOfBirth ?? null,
  guardianName: payload.guardianName ?? null,
  guardianPhone: payload.guardianPhone,
  registrationDate: payload.registrationDate,
  status: payload.status,
  class: { connect: { id: payload.classId } },
});

const buildUpdateInput = (payload: UpdateStudentPayload): Prisma.StudentUpdateInput => {
  const data: Prisma.StudentUpdateInput = {};

  if (payload.fullName !== undefined) {
    data.fullName = payload.fullName;
  }

  if (payload.gender !== undefined) {
    data.gender = payload.gender;
  }

  if (payload.dateOfBirth !== undefined) {
    data.dateOfBirth = payload.dateOfBirth;
  }

  if (payload.guardianName !== undefined) {
    data.guardianName = payload.guardianName;
  }

  if (payload.guardianPhone !== undefined) {
    data.guardianPhone = payload.guardianPhone;
  }

  if (payload.registrationDate !== undefined) {
    data.registrationDate = payload.registrationDate;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (payload.classId !== undefined) {
    data.class = { connect: { id: payload.classId } };
  }

  return data;
};

export const createStudentService = async (payload: CreateStudentPayload) => {
  const student = await studentRepository.create(buildCreateInput(payload));
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
    const student = await studentRepository.update(id, buildUpdateInput(payload));
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
