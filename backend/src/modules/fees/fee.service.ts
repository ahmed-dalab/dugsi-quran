import { isValidObjectId, type Types } from "mongoose";
import type { Request } from "express";
import { ClassModel } from "../classes/class.model";
import { StudentModel } from "../students/student.model";
import { FeePaymentModel, type FeePaymentStatus, type IFeePayment } from "./fee.model";
import {
  buildSearchFilter,
  getPaginateOptions,
  getQueryString,
  parsePaginationQuery,
  toPaginatedList,
} from "../../utils/pagination";

type CreateFeePayload = Omit<IFeePayment, "status">;
type UpdateFeePayload = Partial<Omit<IFeePayment, "status">>;

const sanitizeFee = (fee: unknown) => {
  if (
    typeof fee === "object" &&
    fee !== null &&
    "toObject" in fee &&
    typeof fee.toObject === "function"
  ) {
    return fee.toObject() as Record<string, unknown>;
  }

  return fee as Record<string, unknown>;
};

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
  if (!isValidObjectId(payload.studentId)) {
    throw new Error("Invalid student id");
  }

  const student = await StudentModel.findById(payload.studentId).lean();

  if (!student) {
    throw new Error("Student not found");
  }

  const classId = payload.classId ?? student.classId;

  if (!isValidObjectId(classId)) {
    throw new Error("Invalid class id");
  }

  if (String(student.classId) !== String(classId)) {
    throw new Error("Selected class does not match student's class");
  }

  let amountDue = payload.amountDue;

  if (amountDue === 0) {
    const classItem = await ClassModel.findById(classId).lean();
    if (!classItem) {
      throw new Error("Class not found");
    }
    amountDue = classItem.monthlyFee;
  }

  const amountPaid = payload.amountPaid ?? 0;

  if (amountPaid > amountDue) {
    throw new Error("Amount paid cannot exceed amount due");
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

  const fee = await FeePaymentModel.create({
    ...normalized,
    receivedBy: userId && isValidObjectId(userId) ? (userId as unknown as Types.ObjectId) : null,
  });

  return getFeeByIdService(String(fee._id));
};

export const getFeesService = async (query: Request["query"]) => {
  const pagination = parsePaginationQuery(query, { sortBy: "createdAt", sortOrder: "desc" });
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(pagination.search, ["note", "status"]),
  };

  const status = getQueryString(query, "status");
  if (status === "paid" || status === "partial" || status === "unpaid") {
    filter.status = status;
  }

  const classId = getQueryString(query, "classId");
  if (classId && isValidObjectId(classId)) {
    filter.classId = classId;
  }

  const studentId = getQueryString(query, "studentId");
  if (studentId && isValidObjectId(studentId)) {
    filter.studentId = studentId;
  }

  const month = Number.parseInt(String(query.month ?? ""), 10);
  if (month >= 1 && month <= 12) {
    filter.month = month;
  }

  const year = Number.parseInt(String(query.year ?? ""), 10);
  if (year >= 2000) {
    filter.year = year;
  }

  const result = await FeePaymentModel.paginate(
    filter,
    getPaginateOptions(pagination, {
      sort: { year: -1, month: -1, createdAt: -1 },
      populate: [
        { path: "studentId", select: "_id fullName" },
        { path: "classId", select: "_id name levelOrder" },
        { path: "receivedBy", select: "_id name" },
      ],
    })
  );

  return toPaginatedList(result, sanitizeFee);
};

export const getFeeByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const fee = await FeePaymentModel.findById(id)
    .populate("studentId", "_id fullName")
    .populate("classId", "_id name levelOrder")
    .populate("receivedBy", "_id name")
    .lean();

  if (!fee) {
    return null;
  }

  return sanitizeFee(fee);
};

export const updateFeeService = async (id: string, payload: UpdateFeePayload) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const existing = await FeePaymentModel.findById(id).lean();

  if (!existing) {
    return null;
  }

  const amountDue = payload.amountDue ?? existing.amountDue;
  const amountPaid = payload.amountPaid ?? existing.amountPaid;

  if (amountPaid > amountDue) {
    throw new Error("Amount paid cannot exceed amount due");
  }

  const status = deriveStatus(amountDue, amountPaid);

  const updated = await FeePaymentModel.findByIdAndUpdate(
    id,
    {
      ...payload,
      status,
      paymentDate: amountPaid > 0 ? payload.paymentDate ?? existing.paymentDate ?? new Date() : null,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("studentId", "_id fullName")
    .populate("classId", "_id name levelOrder")
    .populate("receivedBy", "_id name")
    .lean();

  if (!updated) {
    return null;
  }

  return sanitizeFee(updated);
};

export const deleteFeeService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const fee = await FeePaymentModel.findByIdAndDelete(id).lean();

  if (!fee) {
    return null;
  }

  return sanitizeFee(fee);
};
