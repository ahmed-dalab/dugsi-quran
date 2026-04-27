import { Schema, model } from "mongoose";
import { USER_ROLE } from "./user.constant";
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}


const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
       match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "teacher"],
      required: true,
      default: "teacher",
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

// 

export const User = model<IUser>("User", userSchema);