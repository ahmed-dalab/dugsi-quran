import { isValidObjectId } from "mongoose";
import { AttendanceModel, type AttendanceStatus } from "./attendance.model";
import { ClassModel } from "../classes/class.model";
import { StudentModel } from "../students/student.model";

export interface AttendanceInputRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface TakeAttendancePayload {
  classId: string;
  date: string;
  records: AttendanceInputRecord[];
  takenBy: string;
}

const sanitizeAttendance = (attendance: unknown) => {
  if (
    typeof attendance === "object" &&
    attendance !== null &&
    "toObject" in attendance &&
    typeof attendance.toObject === "function"
  ) {
    return attendance.toObject() as Record<string, unknown>;
  }

  return attendance as Record<string, unknown>;
};

const isValidDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const takeAttendanceService = async (payload: TakeAttendancePayload) => {
  const { classId, date, records, takenBy } = payload;

  if (!isValidObjectId(classId)) {
    throw new Error("Invalid class id");
  }

  if (!isValidDateString(date)) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  const classItem = await ClassModel.findById(classId).lean();
  if (!classItem) {
    throw new Error("Class not found");
  }

  const activeStudents = await StudentModel.find({
    classId,
    status: "active",
  })
    .select("_id")
    .lean();

  const activeStudentIds = new Set(activeStudents.map((s) => s._id.toString()));

  if (records.length === 0) {
    throw new Error("Attendance records are required");
  }

  const uniqueStudents = new Set<string>();
  for (const record of records) {
    if (!isValidObjectId(record.studentId)) {
      throw new Error(`Invalid student id: ${record.studentId}`);
    }

    if (!activeStudentIds.has(record.studentId)) {
      throw new Error("One or more students do not belong to this class");
    }

    if (uniqueStudents.has(record.studentId)) {
      throw new Error("Duplicate student attendance record found");
    }

    uniqueStudents.add(record.studentId);
  }

  const normalizedRecords = records.map((record) => ({
    studentId: record.studentId,
    status: record.status,
    note: record.note?.trim() || undefined,
  }));

  const attendance = await AttendanceModel.findOneAndUpdate(
    { classId, date },
    {
      classId,
      date,
      records: normalizedRecords,
      takenBy,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
    .populate("classId", "_id name levelOrder")
    .populate("takenBy", "_id name email")
    .populate("records.studentId", "_id fullName classId")
    .lean();

  return sanitizeAttendance(attendance);
};

export const getAttendanceByClassAndDateService = async (classId: string, date: string) => {
  if (!isValidObjectId(classId)) {
    return null;
  }

  if (!isValidDateString(date)) {
    return null;
  }

  const attendance = await AttendanceModel.findOne({ classId, date })
    .populate("classId", "_id name levelOrder")
    .populate("takenBy", "_id name email")
    .populate("records.studentId", "_id fullName classId")
    .lean();

  if (!attendance) {
    return null;
  }

  return sanitizeAttendance(attendance);
};

export const getAttendanceHistoryByClassService = async (classId: string) => {
  if (!isValidObjectId(classId)) {
    return [];
  }

  const attendanceHistory = await AttendanceModel.find({ classId })
    .populate("takenBy", "_id name email")
    .sort({ date: -1 })
    .lean();

  return attendanceHistory.map((item) => sanitizeAttendance(item));
};
