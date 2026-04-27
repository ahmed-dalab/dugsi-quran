import { Schema, model, type Types } from "mongoose";

export interface IClass {
  name: string;
  levelOrder: number;
  monthlyFee: number;
  teacherId?: Types.ObjectId | null;
  isActive: boolean;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      minlength: [2, "Class name must be at least 2 characters"],
      unique: true,
    },
    levelOrder: {
      type: Number,
      required: [true, "Level order is required"],
      min: [1, "Level order must be at least 1"],
      unique: true,
    },
    monthlyFee: {
      type: Number,
      default: 0,
      min: [0, "Monthly fee cannot be negative"],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ClassModel = model<IClass>("Class", classSchema);
