import { tableShellClass } from "@/design-system/nav";
import type { Attendance } from "../types/attendance.types";
import {
  getAttendanceClassName,
  getAttendanceCounters,
  getAttendanceTakenByName,
} from "../utils/attendanceDisplay";

interface AttendanceHistoryTableProps {
  records: Attendance[];
}

export default function AttendanceHistoryTable({ records }: AttendanceHistoryTableProps) {
  return (
    <div className={tableShellClass}>
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Class</th>
            <th className="px-4 py-3 text-left">Present</th>
            <th className="px-4 py-3 text-left">Absent</th>
            <th className="px-4 py-3 text-left">Taken By</th>
          </tr>
        </thead>
        <tbody>
          {records.map((entry) => {
            const counters = getAttendanceCounters(entry.records);

            return (
              <tr key={entry._id} className="border-b last:border-b-0">
                <td className="px-4 py-3">{entry.date}</td>
                <td className="px-4 py-3">{getAttendanceClassName(entry.classId)}</td>
                <td className="px-4 py-3">{counters.present}</td>
                <td className="px-4 py-3">{counters.absent}</td>
                <td className="px-4 py-3">{getAttendanceTakenByName(entry.takenBy)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
