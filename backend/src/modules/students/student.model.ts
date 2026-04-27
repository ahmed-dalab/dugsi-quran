import { Schema, model, type Types } from "mongoose";

export type StudentGender = "male" | "female";
export type StudentStatus = "active" | "inactive";

export interface IStudent {
  fullName: string;
  gender: StudentGender;
  dateOfBirth?: Date | null;
  guardianName?: string | null;
  guardianPhone: string;
  classId: Types.ObjectId;
  registrationDate: Date;
  status: StudentStatus;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: {
      type: String,
      required: [true, "Student full name is required"],
      trim: true,
      minlength: [2, "Student name must be at least 2 characters"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    guardianName: {
      type: String,
      trim: true,
      default: null,
    },
    guardianPhone: {
      type: String,
      required: [true, "Guardian phone is required"],
      trim: true,
      minlength: [7, "Guardian phone must be at least 7 characters"],
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentModel = model<IStudent>("Student", studentSchema);
