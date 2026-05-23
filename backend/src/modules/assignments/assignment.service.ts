import { isValidObjectId } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import type { Request } from "express";
import { AssignmentModel, type ITeacherClassAssignment } from "./assignment.model";
import { TeacherModel } from "../teachers/teacher.model";
import {
  buildSearchFilter,
  emptyPaginatedList,
  getPaginateOptions,
  getQueryString,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";

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

const sanitizeAssignment = (assignment: unknown) => {
  if (
    typeof assignment === "object" &&
    assignment !== null &&
    "toObject" in assignment &&
    typeof assignment.toObject === "function"
  ) {
    return assignment.toObject() as Record<string, unknown>;
  }

  return assignment as Record<string, unknown>;
};

export const createAssignmentService = async (payload: CreateAssignmentPayload) => {
  const { teacherId, classId, notes, assignedBy } = payload;

  // Check if teacher exists
  const teacher = await TeacherModel.findById(teacherId);
  if (!teacher) {
    throw new AppError(404, "Teacher not found");
  }

  // Check if there's already an active assignment for this teacher and class
  const existingAssignment = await AssignmentModel.findOne({
    teacherId,
    classId,
    status: "active",
  });

  if (existingAssignment) {
    throw new AppError(409, "Teacher is already assigned to this class");
  }

  // End any existing active assignments for this teacher (teacher can only have one active class at a time)
  await AssignmentModel.updateMany(
    { teacherId, status: "active" },
    { 
      status: "ended", 
      endDate: new Date(),
      $push: { 
        notes: notes ? `Automatically ended due to new assignment: ${notes}` : "Automatically ended due to new assignment"
      }
    }
  );

  // Create new assignment
  const assignment = await AssignmentModel.create({
    teacherId,
    classId,
    notes,
    assignedBy,
  });

  // Populate the assignment with teacher and class details
  const populatedAssignment = await AssignmentModel.findById(assignment._id)
    .populate("teacherId", "userId")
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .lean();

  return sanitizeAssignment(populatedAssignment);
};

const assignmentPopulateOptions = [
  { path: "teacherId", select: "userId" },
  { path: "classId", select: "name levelOrder" },
  { path: "assignedBy", select: "name email" },
];

const buildAssignmentListFilter = (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "assignedDate", sortOrder: "desc" });
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(pagination.search, ["notes", "status"]),
  };

  const status = getQueryString(query, "status");
  if (status === "active" || status === "inactive" || status === "ended") {
    filter.status = status;
  }

  return { pagination, filter };
};

export const getAssignmentsService = async (query: Request["query"]) => {
  const { pagination, filter } = buildAssignmentListFilter(query);
  const result = await AssignmentModel.paginate(
    filter,
    getPaginateOptions(pagination, {
      sort: { assignedDate: -1 },
      populate: assignmentPopulateOptions,
    })
  );

  return toPaginatedList(result, sanitizeAssignment);
};

export const getAssignmentByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const assignment = await AssignmentModel.findById(id)
    .populate("teacherId", "userId")
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .lean();

  if (!assignment) {
    return null;
  }

  return sanitizeAssignment(assignment);
};

export const getAssignmentsByTeacherService = async (teacherId: string, query: Request["query"]) => {
  if (!isValidObjectId(teacherId)) {
    return emptyPaginatedList();
  }

  const { pagination, filter } = buildAssignmentListFilter(query);
  const result = await AssignmentModel.paginate(
    { ...filter, teacherId },
    getPaginateOptions(pagination, {
      sort: { assignedDate: -1 },
      populate: [
        { path: "classId", select: "name levelOrder" },
        { path: "assignedBy", select: "name email" },
      ],
    })
  );

  return toPaginatedList(result, sanitizeAssignment);
};

export const getAssignmentsByClassService = async (classId: string, query: Request["query"]) => {
  if (!isValidObjectId(classId)) {
    return emptyPaginatedList();
  }

  const { pagination, filter } = buildAssignmentListFilter(query);
  const result = await AssignmentModel.paginate(
    { ...filter, classId },
    getPaginateOptions(pagination, {
      sort: { assignedDate: -1 },
      populate: [
        { path: "teacherId", select: "userId" },
        { path: "assignedBy", select: "name email" },
      ],
    })
  );

  return toPaginatedList(result, sanitizeAssignment);
};

export const updateAssignmentService = async (
  id: string,
  payload: UpdateAssignmentPayload
) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const assignment = await AssignmentModel.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("teacherId", "userId")
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .lean();

  if (!assignment) {
    return null;
  }

  return sanitizeAssignment(assignment);
};

export const deleteAssignmentService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const assignment = await AssignmentModel.findByIdAndDelete(id).lean();

  if (!assignment) {
    return null;
  }

  return sanitizeAssignment(assignment);
};

export const getCurrentAssignmentForTeacherService = async (teacherId: string) => {
  if (!isValidObjectId(teacherId)) {
    return null;
  }

  const assignment = await AssignmentModel.findOne({
    teacherId,
    status: "active",
  })
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .lean();

  if (!assignment) {
    return null;
  }

  return sanitizeAssignment(assignment);
};
