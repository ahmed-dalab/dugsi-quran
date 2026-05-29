import type { Request } from "express";
import { AppError } from "../../shared/errors/AppError";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import {
  FEE_STATUSES,
  parseEnumFilter,
  parseMonthFilter,
  parseOptionalUuidQuery,
  parseYearFilter,
} from "../../utils/queryFilters";
import { getByIdOrNull, mapPaginatedResult, mutateOrNull } from "../../utils/serviceHelpers";
import { mapFeeRecord } from "../../utils/mappers";
import { classRepository } from "../classes/class.repository";
import { studentRepository } from "../students/student.repository";
import type { FeePaymentStatus } from "./fee.model";
import { feeRepository } from "./fee.repository";

type CreateFeePayload = {
  studentId: string;
  amountPaid?: number;
  paymentDate?: Date | null;
  note?: string | null;
};
type UpdateFeePayload = Partial<CreateFeePayload>;

const deriveStatus = (amountDue: number, amountPaid: number): FeePaymentStatus => {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= amountDue) return "paid";
  return "partial";
};

const normalizeCreatePayload = async (payload: CreateFeePayload) => {
  if (!isValidId(payload.studentId)) {
    throw new AppError(400, "Invalid student id");
  }

  const student = await studentRepository.findById(payload.studentId);
  if (!student) {
    throw new AppError(404, "Student not found");
  }

  const classItem = await classRepository.findById(student.classId);
  if (!classItem) {
    throw new AppError(404, "Class not found");
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const amountDue = classItem.monthlyFee;
  const amountPaid = payload.amountPaid ?? 0;

  const existing = await feeRepository.findByStudentPeriod(payload.studentId, month, year);
  if (existing) {
    throw new AppError(409, "This student already has a fee record for the current month");
  }

  if (amountPaid > amountDue) {
    throw new AppError(400, "Amount paid cannot exceed the class monthly fee");
  }

  return {
    studentId: payload.studentId,
    classId: student.classId,
    month,
    year,
    amountDue,
    amountPaid,
    status: deriveStatus(amountDue, amountPaid),
    paymentDate: amountPaid > 0 ? payload.paymentDate ?? now : null,
    note: payload.note?.trim() || undefined,
  };
};

export const createFeeService = async (payload: CreateFeePayload, userId?: string) => {
  const normalized = await normalizeCreatePayload(payload);

  const fee = await feeRepository.create({
    student: { connect: { id: normalized.studentId } },
    class: { connect: { id: normalized.classId } },
    month: normalized.month,
    year: normalized.year,
    amountDue: normalized.amountDue,
    amountPaid: normalized.amountPaid,
    status: normalized.status,
    paymentDate: normalized.paymentDate,
    note: normalized.note,
    ...(userId && isValidId(userId) ? { receivedBy: { connect: { id: userId } } } : {}),
  });

  return mapFeeRecord(fee);
};

export const getFeesService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });

  const result = await feeRepository.findPaginated(pagination, {
    status: parseEnumFilter(getQueryString(query, "status"), FEE_STATUSES),
    classId: parseOptionalUuidQuery(query, "classId"),
    studentId: parseOptionalUuidQuery(query, "studentId"),
    month: parseMonthFilter(query.month),
    year: parseYearFilter(query.year),
  });

  return mapPaginatedResult(result, mapFeeRecord);
};

export const getFeeByIdService = (id: string) =>
  getByIdOrNull(id, async (validId) => {
    const fee = await feeRepository.findById(validId);
    return fee ? mapFeeRecord(fee) : null;
  });

export const updateFeeService = async (id: string, payload: UpdateFeePayload) => {
  if (!isValidId(id)) {
    return null;
  }

  const existing = await feeRepository.findById(id);
  if (!existing) {
    return null;
  }

  const amountDue = existing.amountDue;
  const amountPaid = payload.amountPaid ?? existing.amountPaid;

  if (amountPaid > amountDue) {
    throw new AppError(400, "Amount paid cannot exceed the class monthly fee");
  }

  const updated = await feeRepository.update(id, {
    amountPaid,
    status: deriveStatus(amountDue, amountPaid),
    paymentDate: amountPaid > 0 ? payload.paymentDate ?? existing.paymentDate ?? new Date() : null,
    ...(payload.note !== undefined ? { note: payload.note?.trim() || null } : {}),
  });

  return mapFeeRecord(updated);
};

export const deleteFeeService = (id: string) =>
  mutateOrNull(id, async (validId) => {
    const fee = await feeRepository.delete(validId);
    return mapFeeRecord(fee);
  });
