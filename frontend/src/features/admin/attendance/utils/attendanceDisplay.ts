import type { Attendance, AttendanceRecord } from "../types/attendance.types";

export function getAttendanceCounters(records: AttendanceRecord[]) {
  return records.reduce(
    (acc, record) => {
      if (record.status === "absent") {
        acc.absent += 1;
      } else {
        acc.present += 1;
      }
      return acc;
    },
    { present: 0, absent: 0 }
  );
}

export function getAttendanceClassName(classId: Attendance["classId"]) {
  return typeof classId === "string" ? "-" : classId.name;
}

export function getAttendanceTakenByName(takenBy: Attendance["takenBy"]) {
  return typeof takenBy === "string" ? "-" : takenBy.name;
}
