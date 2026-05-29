import type { Request } from "express";
import { AppError } from "../../shared/errors/AppError";
import { isValidId } from "../../utils/id";
import { emptyPaginatedList, getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { parseOptionalUuidQuery } from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult } from "../../utils/serviceHelpers";
import { mapAttendanceRecord } from "../../utils/mappers";
import { classRepository } from "../classes/class.repository";
import { studentRepository } from "../students/student.repository";
import type { AttendanceStatus } from "./attendance.model";
import { attendanceRepository } from "./attendance.repository";

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

const isValidDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const takeAttendanceService = async (payload: TakeAttendancePayload) => {
  const { classId, date, records, takenBy } = payload;

  if (!isValidId(classId)) {
    throw new AppError(400, "Invalid class id");
  }

  if (!isValidDateString(date)) {
    throw new AppError(400, "Date must be in YYYY-MM-DD format");
  }

  const classItem = await classRepository.findById(classId);
  if (!classItem) {
    throw new AppError(404, "Class not found");
  }

  const activeStudents = await studentRepository.findActiveIdsByClass(classId);
  const activeStudentIds = new Set(activeStudents.map((student) => student.id));

  if (records.length === 0) {
    throw new AppError(400, "Attendance records are required");
  }

  const uniqueStudents = new Set<string>();
  for (const record of records) {
    if (!isValidId(record.studentId)) {
      throw new AppError(400, `Invalid student id: ${record.studentId}`);
    }

    if (!activeStudentIds.has(record.studentId)) {
      throw new AppError(400, "One or more students do not belong to this class");
    }

    if (uniqueStudents.has(record.studentId)) {
      throw new AppError(400, "Duplicate student attendance record found");
    }

    uniqueStudents.add(record.studentId);
  }

  const attendance = await attendanceRepository.upsertWithRecords({
    classId,
    date,
    takenById: takenBy,
    records: records.map((record) => ({
      studentId: record.studentId,
      status: record.status,
      note: record.note?.trim() || undefined,
    })),
  });

  return attendance ? mapAttendanceRecord(attendance) : null;
};

export const getAttendanceByClassAndDateService = (classId: string, date: string) =>
  getByIdOrNull(classId, async (validClassId) => {
    if (!isValidDateString(date)) {
      return null;
    }

    const attendance = await attendanceRepository.findByClassAndDate(validClassId, date);
    return attendance ? mapAttendanceRecord(attendance) : null;
  });

export const getAttendanceListService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "date", sortOrder: "desc" });

  const result = await attendanceRepository.findPaginated(pagination, {
    classId: parseOptionalUuidQuery(query, "classId"),
    fromDate: getQueryString(query, "fromDate"),
    toDate: getQueryString(query, "toDate"),
  });

  return mapPaginatedResult(result, mapAttendanceRecord);
};

export const getAttendanceHistoryByClassService = async (classId: string, query: Request["query"]) => {
  if (!isValidId(classId)) {
    return emptyPaginatedList();
  }

  const pagination = parsePaginationQuery(query, { sortBy: "date", sortOrder: "desc" });

  const result = await attendanceRepository.findHistoryByClass(classId, pagination, {
    fromDate: getQueryString(query, "fromDate"),
    toDate: getQueryString(query, "toDate"),
  });

  return mapPaginatedResult(result, mapAttendanceRecord);
};
