import type { Request } from "express";
import { AppError } from "../../shared/errors/AppError";
import { isValidId } from "../../utils/id";
import { emptyPaginatedList, getQueryString, parsePaginationQuery } from "../../utils/pagination";
import {
  ASSIGNMENT_STATUSES,
  parseEnumFilter,
} from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult, mutateOrNull } from "../../utils/serviceHelpers";
import { mapAssignmentRecord } from "../../utils/mappers";
import { teacherRepository } from "../teachers/teacher.repository";
import { assignmentRepository } from "./assignment.repository";

export interface CreateAssignmentPayload {
  teacherId: string;
  classId: string;
  notes?: string;
  assignedBy: string;
}

export interface UpdateAssignmentPayload {
  status?: "active" | "inactive" | "ended";
  endDate?: Date | null;
  notes?: string;
}

const parseAssignmentStatus = (query: Request["query"]) =>
  parseEnumFilter(getQueryString(query, "status"), ASSIGNMENT_STATUSES);

export const createAssignmentService = async (payload: CreateAssignmentPayload) => {
  const { teacherId, classId, notes, assignedBy } = payload;

  const teacher = await teacherRepository.findById(teacherId);
  if (!teacher) {
    throw new AppError(404, "Teacher not found");
  }

  const existingAssignment = await assignmentRepository.findActiveByTeacherAndClass(teacherId, classId);
  if (existingAssignment) {
    throw new AppError(409, "Teacher is already assigned to this class");
  }

  await assignmentRepository.endActiveForTeacher(teacherId, notes);

  const assignment = await assignmentRepository.create({
    teacher: { connect: { id: teacherId } },
    class: { connect: { id: classId } },
    assignedBy: { connect: { id: assignedBy } },
    notes,
  });

  return mapAssignmentRecord(assignment);
};

export const getAssignmentsService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const result = await assignmentRepository.findPaginated(pagination, {
    status: parseAssignmentStatus(query),
  });

  return mapPaginatedResult(result, mapAssignmentRecord);
};

export const getAssignmentByIdService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const assignment = await assignmentRepository.findById(validId);
    return assignment ? mapAssignmentRecord(assignment) : null;
  });

export const getAssignmentsByTeacherService = async (teacherId: string, query: Request["query"]) => {
  if (!isValidId(teacherId)) {
    return emptyPaginatedList();
  }

  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const result = await assignmentRepository.findPaginated(pagination, {
    teacherId,
    status: parseAssignmentStatus(query),
  });

  return mapPaginatedResult(result, mapAssignmentRecord);
};

export const getAssignmentsByClassService = async (classId: string, query: Request["query"]) => {
  if (!isValidId(classId)) {
    return emptyPaginatedList();
  }

  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const result = await assignmentRepository.findPaginated(pagination, {
    classId,
    status: parseAssignmentStatus(query),
  });

  return mapPaginatedResult(result, mapAssignmentRecord);
};

export const updateAssignmentService = (id: string, payload: UpdateAssignmentPayload) =>
  mutateOrNull(id, async (validId) => {
    const assignment = await assignmentRepository.update(validId, payload);
    return mapAssignmentRecord(assignment);
  });

export const deleteAssignmentService = (id: string) =>
  mutateOrNull(id, async (validId) => {
    const assignment = await assignmentRepository.delete(validId);
    return mapAssignmentRecord(assignment);
  });

export const getCurrentAssignmentForTeacherService = (teacherId: string) =>
  getByIdOrNull(teacherId, async (validId) => {
    const assignment = await assignmentRepository.findActiveForTeacher(validId);
    return assignment ? mapAssignmentRecord(assignment) : null;
  });
