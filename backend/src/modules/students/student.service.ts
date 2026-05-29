import type { Request } from "express";
import type { Prisma } from "../../../generated/prisma";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import {
  ACTIVE_INACTIVE,
  parseEnumFilter,
  parseOptionalUuidQuery,
  STUDENT_GENDERS,
} from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult, mutateOrNull } from "../../utils/serviceHelpers";
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

  if (payload.fullName !== undefined) data.fullName = payload.fullName;
  if (payload.gender !== undefined) data.gender = payload.gender;
  if (payload.dateOfBirth !== undefined) data.dateOfBirth = payload.dateOfBirth;
  if (payload.guardianName !== undefined) data.guardianName = payload.guardianName;
  if (payload.guardianPhone !== undefined) data.guardianPhone = payload.guardianPhone;
  if (payload.registrationDate !== undefined) data.registrationDate = payload.registrationDate;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.classId !== undefined) data.class = { connect: { id: payload.classId } };

  return data;
};

export const createStudentService = async (payload: CreateStudentPayload) => {
  const student = await studentRepository.create(buildCreateInput(payload));
  return mapStudentRecord(student);
};

export const getStudentsService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });

  const result = await studentRepository.findPaginated(pagination, {
    classId: parseOptionalUuidQuery(query, "classId"),
    status: parseEnumFilter(getQueryString(query, "status"), ACTIVE_INACTIVE),
    gender: parseEnumFilter(getQueryString(query, "gender"), STUDENT_GENDERS),
  });

  return mapPaginatedResult(result, mapStudentRecord);
};

export const getStudentByIdService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const student = await studentRepository.findById(validId);
    return student ? mapStudentRecord(student) : null;
  });

export const updateStudentService = (id: string, payload: UpdateStudentPayload) =>
  mutateOrNull(id, async (validId) => {
    const student = await studentRepository.update(validId, buildUpdateInput(payload));
    return mapStudentRecord(student);
  });

export const deleteStudentService = (id: string) =>
  mutateOrNull(id, async (validId) => {
    const student = await studentRepository.delete(validId);
    return mapStudentRecord(student);
  });
