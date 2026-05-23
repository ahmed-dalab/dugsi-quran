import type { Request } from "express";
import { AppError } from "../../shared/errors/AppError";
import { isValidId } from "../../utils/id";
import { getQueryString, parsePaginationQuery } from "../../utils/pagination";
import { mapFeeRecord } from "../../utils/mappers";
import { classRepository } from "../classes/class.repository";
import { studentRepository } from "../students/student.repository";
import type { FeePaymentStatus, IFeePayment } from "./fee.model";
import { feeRepository } from "./fee.repository";

type CreateFeePayload = Omit<IFeePayment, "status">;
type UpdateFeePayload = Partial<Omit<IFeePayment, "status">>;

const deriveStatus = (amountDue: number, amountPaid: number): FeePaymentStatus => {
  if (amountPaid <= 0) {
    return "unpaid";
  }

  if (amountPaid >= amountDue) {
    return "paid";
  }

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

  const classId = payload.classId ?? student.classId;

  if (!isValidId(classId)) {
    throw new AppError(400, "Invalid class id");
  }

  if (student.classId !== classId) {
    throw new AppError(400, "Selected class does not match student's class");
  }

  let amountDue = payload.amountDue;

  if (amountDue === 0) {
    const classItem = await classRepository.findById(classId);
    if (!classItem) {
      throw new AppError(404, "Class not found");
    }
    amountDue = classItem.monthlyFee;
  }

  const amountPaid = payload.amountPaid ?? 0;

  if (amountPaid > amountDue) {
    throw new AppError(400, "Amount paid cannot exceed amount due");
  }

  return {
    ...payload,
    classId,
    amountDue,
    amountPaid,
    status: deriveStatus(amountDue, amountPaid),
    paymentDate: amountPaid > 0 ? payload.paymentDate ?? new Date() : null,
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
  const status = getQueryString(query, "status");
  const classId = getQueryString(query, "classId");
  const studentId = getQueryString(query, "studentId");
  const month = Number.parseInt(String(query.month ?? ""), 10);
  const year = Number.parseInt(String(query.year ?? ""), 10);

  const result = await feeRepository.findPaginated(pagination, {
    status: status === "paid" || status === "partial" || status === "unpaid" ? status : undefined,
    classId: classId && isValidId(classId) ? classId : undefined,
    studentId: studentId && isValidId(studentId) ? studentId : undefined,
    month: month >= 1 && month <= 12 ? month : undefined,
    year: year >= 2000 ? year : undefined,
  });

  return {
    data: result.docs.map(mapFeeRecord),
    pagination: result.pagination,
  };
};

export const getFeeByIdService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  const fee = await feeRepository.findById(id);
  return fee ? mapFeeRecord(fee) : null;
};

export const updateFeeService = async (id: string, payload: UpdateFeePayload) => {
  if (!isValidId(id)) {
    return null;
  }

  const existing = await feeRepository.findById(id);
  if (!existing) {
    return null;
  }

  const amountDue = payload.amountDue ?? existing.amountDue;
  const amountPaid = payload.amountPaid ?? existing.amountPaid;

  if (amountPaid > amountDue) {
    throw new AppError(400, "Amount paid cannot exceed amount due");
  }

  const status = deriveStatus(amountDue, amountPaid);

  const { receivedBy: _receivedBy, ...feeFields } = payload;

  const updated = await feeRepository.update(id, {
    ...feeFields,
    status,
    paymentDate: amountPaid > 0 ? payload.paymentDate ?? existing.paymentDate ?? new Date() : null,
  });

  return mapFeeRecord(updated);
};

export const deleteFeeService = async (id: string) => {
  if (!isValidId(id)) {
    return null;
  }

  try {
    const fee = await feeRepository.delete(id);
    return mapFeeRecord(fee);
  } catch {
    return null;
  }
};
