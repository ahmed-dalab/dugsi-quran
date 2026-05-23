import type { Request } from "express";
import { AppError } from "../../shared/errors/AppError";
import { isValidId } from "../../utils/id";
import { emptyPaginatedList, getQueryString, parsePaginationQuery } from "../../utils/pagination";
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
  const status = getQueryString(query, "status");

  const result = await assignmentRepository.findPaginated(pagination, {
    status: status === "active" || status === "inactive" || status === "ended" ? status : undefined,
  });

  return {
    data: result.docs.map(mapAssignmentRecord),
    pagination: result.pagination,
  };
};

export const getAssignmentByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const assignment = await assignmentRepository.findById(id);
  return assignment ? mapAssignmentRecord(assignment) : null;
};

export const getAssignmentsByTeacherService = async (teacherId: string, query: Request["query"]) => {
  if (!isValidId(teacherId)) {
    return emptyPaginatedList();
  }

  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const status = getQueryString(query, "status");

  const result = await assignmentRepository.findPaginated(pagination, {
    teacherId,
    status: status === "active" || status === "inactive" || status === "ended" ? status : undefined,
  });

  return {
    data: result.docs.map(mapAssignmentRecord),
    pagination: result.pagination,
  };
};

export const getAssignmentsByClassService = async (classId: string, query: Request["query"]) => {
  if (!isValidId(classId)) {
    return emptyPaginatedList();
  }

  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const status = getQueryString(query, "status");

  const result = await assignmentRepository.findPaginated(pagination, {
    classId,
    status: status === "active" || status === "inactive" || status === "ended" ? status : undefined,
  });

  return {
    data: result.docs.map(mapAssignmentRecord),
    pagination: result.pagination,
  };
};

export const updateAssignmentService = async (id: string, payload: UpdateAssignmentPayload) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const assignment = await assignmentRepository.update(id, payload);
    return mapAssignmentRecord(assignment);
  } catch {
    return null;
  }
};

export const deleteAssignmentService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const assignment = await assignmentRepository.delete(id);
    return mapAssignmentRecord(assignment);
  } catch {
    return null;
  }
};

export const getCurrentAssignmentForTeacherService = async (teacherId: string) => {
  if (!isValidId(teacherId)) {
    return null;
  }

  const assignment = await assignmentRepository.findActiveForTeacher(teacherId);
  return assignment ? mapAssignmentRecord(assignment) : null;
};
