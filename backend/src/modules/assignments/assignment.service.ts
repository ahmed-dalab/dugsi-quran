import { isValidObjectId } from "mongoose";
import { AssignmentModel, type ITeacherClassAssignment } from "./assignment.model";
import { TeacherModel } from "../teachers/teacher.model";
import { User } from "../users/user.model";

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
    throw new Error("Teacher not found");
  }

  // Check if there's already an active assignment for this teacher and class
  const existingAssignment = await AssignmentModel.findOne({
    teacherId,
    classId,
    status: "active",
  });

  if (existingAssignment) {
    throw new Error("Teacher is already assigned to this class");
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

export const getAssignmentsService = async (status?: string) => {
  const filter = status ? { status } : {};
  
  const assignments = await AssignmentModel.find(filter)
    .populate("teacherId", "userId")
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .sort({ assignedDate: -1 })
    .lean();

  return assignments.map((assignment) => sanitizeAssignment(assignment));
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

export const getAssignmentsByTeacherService = async (teacherId: string) => {
  if (!isValidObjectId(teacherId)) {
    return [];
  }

  const assignments = await AssignmentModel.find({ teacherId })
    .populate("classId", "name levelOrder")
    .populate("assignedBy", "name email")
    .sort({ assignedDate: -1 })
    .lean();

  return assignments.map((assignment) => sanitizeAssignment(assignment));
};

export const getAssignmentsByClassService = async (classId: string) => {
  if (!isValidObjectId(classId)) {
    return [];
  }

  const assignments = await AssignmentModel.find({ classId })
    .populate("teacherId", "userId")
    .populate("assignedBy", "name email")
    .sort({ assignedDate: -1 })
    .lean();

  return assignments.map((assignment) => sanitizeAssignment(assignment));
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
