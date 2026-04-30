import { Schema, model, type Types } from "mongoose";

export type AssignmentStatus = "active" | "inactive" | "ended";

export interface ITeacherClassAssignment {
  teacherId: Types.ObjectId;
  classId: Types.ObjectId;
  status: AssignmentStatus;
  assignedDate: Date;
  endDate?: Date | null;
  assignedBy: Types.ObjectId; // Admin who made the assignment
  notes?: string;
}

const assignmentSchema = new Schema<ITeacherClassAssignment>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "ended"],
      default: "active",
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned by is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
assignmentSchema.index({ teacherId: 1, status: 1 });
assignmentSchema.index({ classId: 1, status: 1 });
assignmentSchema.index({ assignedDate: -1 });

// Ensure a teacher can only have one active assignment to a specific class
assignmentSchema.index(
  { teacherId: 1, classId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export const AssignmentModel = model<ITeacherClassAssignment>("Assignment", assignmentSchema);
