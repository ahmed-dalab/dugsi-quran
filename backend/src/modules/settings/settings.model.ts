import { Schema, model } from "mongoose";

export interface ISettings {
  schoolName: string;
  schoolEmail?: string | null;
  schoolPhone?: string | null;
  schoolAddress?: string | null;
  timezone: string;
  currency: string;
  attendanceEditWindowDays: number;
  activeAcademicYear: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      minlength: [2, "School name must be at least 2 characters"],
      default: "Dugsi Quran",
    },
    schoolEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    schoolPhone: {
      type: String,
      trim: true,
      default: null,
    },
    schoolAddress: {
      type: String,
      trim: true,
      default: null,
    },
    timezone: {
      type: String,
      trim: true,
      default: "Africa/Mogadishu",
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "USD",
      minlength: [3, "Currency must be 3 characters"],
      maxlength: [3, "Currency must be 3 characters"],
    },
    attendanceEditWindowDays: {
      type: Number,
      default: 7,
      min: [0, "Attendance edit window cannot be negative"],
      max: [60, "Attendance edit window cannot be greater than 60 days"],
    },
    activeAcademicYear: {
      type: String,
      trim: true,
      default: "2026",
    },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel = model<ISettings>("Settings", settingsSchema);
