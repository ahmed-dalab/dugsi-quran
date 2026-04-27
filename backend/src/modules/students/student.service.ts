import { isValidObjectId } from "mongoose";
import { StudentModel, type IStudent } from "./student.model";

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

export const getStudentsService = async () => {
  const students = await StudentModel.find()
    .sort({ createdAt: -1 })
    .populate("classId", "_id name levelOrder")
    .lean();

  return students.map((student) => sanitizeStudent(student));
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
