import { isValidObjectId } from "mongoose";
import type { Request } from "express";
import { TeacherModel, type ITeacher } from "./teacher.model";
import { User } from "../users/user.model";
import {
  escapeRegex,
  getPaginateOptions,
  getQueryString,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";

type CreateTeacherPayload = Omit<ITeacher, "userId"> & { 
  name: string;
  email: string;
  password: string;
};

type UpdateTeacherPayload = Partial<Omit<ITeacher, "userId">> & {
  name?: string;
  email?: string;
  password?: string;
};

const sanitizeTeacher = (teacher: unknown) => {
  if (
    typeof teacher === "object" &&
    teacher !== null &&
    "toObject" in teacher &&
    typeof teacher.toObject === "function"
  ) {
    return teacher.toObject() as Record<string, unknown>;
  }

  return teacher as Record<string, unknown>;
};

export const createTeacherService = async (payload: CreateTeacherPayload) => {
  const { name, email, password, ...teacherData } = payload;

  // Create user first
  const user = await User.create({
    name,
    email,
    password,
    role: "teacher",
    isActive: true,
  });

  // Create teacher profile
  const teacher = await TeacherModel.create({
    ...teacherData,
    userId: user._id,
  });

  // Populate user data
  const populatedTeacher = await TeacherModel.findById(teacher._id)
    .populate("userId", "name email role isActive")
    .lean();

  return sanitizeTeacher(populatedTeacher);
};

const buildTeacherListFilter = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const filter: Record<string, unknown> = {};

  if (pagination.search) {
    const regex = new RegExp(escapeRegex(pagination.search), "i");
    const matchingUsers = await User.find({
      $or: [{ name: regex }, { email: regex }],
    })
      .select("_id")
      .lean();
    const userIds = matchingUsers.map((user) => user._id);

    filter.$or = [
      { phone: regex },
      { employeeId: regex },
      { qualification: regex },
      { specialization: regex },
      { experience: regex },
      { "emergencyContact.name": regex },
      { "emergencyContact.phone": regex },
      ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : []),
    ];
  }

  const status = getQueryString(query, "status");
  if (status === "active" || status === "inactive") {
    filter.status = status;
  }

  const employmentType = getQueryString(query, "employmentType");
  if (employmentType === "full-time" || employmentType === "part-time" || employmentType === "volunteer") {
    filter.employmentType = employmentType;
  }

  return { pagination, filter };
};

export const getTeachersService = async (query: Request["query"]) => {
  const { pagination, filter } = await buildTeacherListFilter(query);
  const result = await TeacherModel.paginate(
    filter,
    getPaginateOptions(pagination, {
      populate: { path: "userId", select: "name email role isActive" },
    })
  );

  return toPaginatedList(result, sanitizeTeacher);
};

export const getTeacherByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const teacher = await TeacherModel.findById(id)
    .populate("userId", "name email role isActive")
    .lean();

  if (!teacher) {
    return null;
  }

  return sanitizeTeacher(teacher);
};

export const updateTeacherService = async (
  id: string,
  payload: UpdateTeacherPayload
) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const { name, email, password, ...teacherData } = payload;

  // Find the teacher first
  const teacher = await TeacherModel.findById(id);
  if (!teacher) {
    return null;
  }

  // Update user data if provided
  if (name || email || password) {
    const userUpdateData: any = {};
    if (name) userUpdateData.name = name;
    if (email) userUpdateData.email = email;
    if (password) userUpdateData.password = password;

    await User.findByIdAndUpdate(teacher.userId, userUpdateData, {
      runValidators: true,
    });
  }

  // Update teacher profile
  const updatedTeacher = await TeacherModel.findByIdAndUpdate(id, teacherData, {
    new: true,
    runValidators: true,
  })
    .populate("userId", "name email role isActive")
    .lean();

  if (!updatedTeacher) {
    return null;
  }

  return sanitizeTeacher(updatedTeacher);
};

export const deleteTeacherService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const teacher = await TeacherModel.findById(id);
  if (!teacher) {
    return null;
  }

  // Delete the teacher profile
  const deletedTeacher = await TeacherModel.findByIdAndDelete(id).lean();

  // Also delete the associated user
  await User.findByIdAndDelete(teacher.userId);

  return sanitizeTeacher(deletedTeacher);
};
