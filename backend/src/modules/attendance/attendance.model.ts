export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface IAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface IAttendance {
  classId: string;
  date: string;
  takenById: string;
  records: IAttendanceRecord[];
}
