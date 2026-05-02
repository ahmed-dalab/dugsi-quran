export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceStudent {
  _id: string;
  fullName: string;
  classId: string;
}

export interface AttendanceRecord {
  studentId: string | AttendanceStudent;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceTakenBy {
  _id: string;
  name: string;
  email: string;
}

export interface AttendanceClass {
  _id: string;
  name: string;
  levelOrder: number;
}

export interface Attendance {
  _id: string;
  classId: string | AttendanceClass;
  date: string;
  takenBy: string | AttendanceTakenBy;
  records: AttendanceRecord[];
  createdAt?: string;
  updatedAt?: string;
}
