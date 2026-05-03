import { Schema, model, type Types } from "mongoose";

export type FeePaymentStatus = "paid" | "partial" | "unpaid";

export interface IFeePayment {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  status: FeePaymentStatus;
  paymentDate?: Date | null;
  receivedBy?: Types.ObjectId | null;
  note?: string | null;
}

const feePaymentSchema = new Schema<IFeePayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
      index: true,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be valid"],
    },
    amountDue: {
      type: Number,
      required: [true, "Amount due is required"],
      min: [0, "Amount due cannot be negative"],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    status: {
      type: String,
      enum: ["paid", "partial", "unpaid"],
      required: true,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

feePaymentSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

export const FeePaymentModel = model<IFeePayment>("FeePayment", feePaymentSchema);
