import { Schema, model, type Types } from "mongoose";

export type TeacherGender = "male" | "female";
export type TeacherStatus = "active" | "inactive";
export type TeacherEmploymentType = "full-time" | "part-time" | "volunteer";

export interface ITeacher {
  userId: Types.ObjectId;
  employeeId?: string;
  phone?: string;
  address?: string;
  gender?: TeacherGender;
  dateOfBirth?: Date | null;
  hireDate?: Date;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: number;
  employmentType?: TeacherEmploymentType;
  status: TeacherStatus;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    employeeId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    qualification: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "volunteer"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
teacherSchema.index({ userId: 1 });
teacherSchema.index({ status: 1 });

export const TeacherModel = model<ITeacher>("Teacher", teacherSchema);
