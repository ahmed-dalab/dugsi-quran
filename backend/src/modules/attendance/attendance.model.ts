import { Schema, model, type Types } from "mongoose";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface IAttendanceRecord {
  studentId: Types.ObjectId;
  status: AttendanceStatus;
  note?: string;
}

export interface IAttendance {
  classId: Types.ObjectId;
  date: string;
  takenBy: Types.ObjectId;
  records: IAttendanceRecord[];
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: [true, "Attendance status is required"],
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const attendanceSchema = new Schema<IAttendance>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    takenBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Taken by user is required"],
    },
    records: {
      type: [attendanceRecordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ classId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });

export const AttendanceModel = model<IAttendance>("Attendance", attendanceSchema);
