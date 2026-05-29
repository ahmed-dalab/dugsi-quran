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

function getRelationDisplayName(
  value: string | { name?: string } | null | undefined,
  fallback = "-"
) {
  if (value == null) {
    return fallback;
  }

  if (typeof value === "string") {
    return value || fallback;
  }

  return value.name ?? fallback;
}

export function getAttendanceClassName(classId: Attendance["classId"]) {
  return getRelationDisplayName(classId);
}

export function getAttendanceTakenByName(takenById: Attendance["takenById"]) {
  return getRelationDisplayName(takenById);
}
