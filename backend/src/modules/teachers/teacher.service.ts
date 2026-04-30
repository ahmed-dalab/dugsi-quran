import { isValidObjectId } from "mongoose";
import { TeacherModel, type ITeacher } from "./teacher.model";
import { User } from "../users/user.model";

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

export const getTeachersService = async () => {
  const teachers = await TeacherModel.find()
    .populate("userId", "name email role isActive")
    .sort({ createdAt: -1 })
    .lean();

  return teachers.map((teacher) => sanitizeTeacher(teacher));
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
