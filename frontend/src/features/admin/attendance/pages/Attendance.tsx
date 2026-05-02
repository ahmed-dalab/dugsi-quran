import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useGetStudentsQuery } from "@/features/admin/students/api/studentApi";
import type { Student } from "@/features/admin/students/types/student.types";
import {
  useGetAttendanceHistoryByClassQuery,
  useLazyGetAttendanceByClassAndDateQuery,
  useTakeAttendanceMutation,
} from "../api/attendanceApi";

const today = new Date().toISOString().slice(0, 10);

const getStudentClassId = (student: Student) =>
  typeof student.classId === "string" ? student.classId : student.classId._id;

const getDisplayName = (student: Student) => student.fullName;

export default function AttendancePage() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [checkedByStudentId, setCheckedByStudentId] = useState<Record<string, boolean>>({});
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  const { data: classesData, isLoading: isClassesLoading } = useGetClassesQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });
  const { data: studentsData, isLoading: isStudentsLoading } = useGetStudentsQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });
  const { data: historyData, isLoading: isHistoryLoading } = useGetAttendanceHistoryByClassQuery(
    selectedClassId,
    { skip: !selectedClassId || isBootstrapping || !accessToken }
  );
  const [fetchAttendanceByDate, { isFetching: isLoadingExistingAttendance }] =
    useLazyGetAttendanceByClassAndDateQuery();
  const [takeAttendance, { isLoading: isSavingAttendance }] = useTakeAttendanceMutation();

  const classStudents = useMemo(() => {
    if (!studentsData?.data || !selectedClassId) {
      return [];
    }

    return studentsData.data.filter(
      (student) => student.status === "active" && getStudentClassId(student) === selectedClassId
    );
  }, [studentsData?.data, selectedClassId]);

  useEffect(() => {
    if (!selectedClassId || !selectedDate || classStudents.length === 0) {
      setCheckedByStudentId({});
      return;
    }

    const fallback = classStudents.reduce<Record<string, boolean>>((acc, student) => {
      acc[student._id] = true;
      return acc;
    }, {});

    const loadExisting = async () => {
      try {
        const response = await fetchAttendanceByDate({
          classId: selectedClassId,
          date: selectedDate,
        }).unwrap();

        const mapped = { ...fallback };
        response.data.records.forEach((record) => {
          const studentId =
            typeof record.studentId === "string" ? record.studentId : record.studentId._id;
          mapped[studentId] = record.status !== "absent";
        });

        setCheckedByStudentId(mapped);
      } catch {
        setCheckedByStudentId(fallback);
      }
    };

    void loadExisting();
  }, [selectedClassId, selectedDate, classStudents, fetchAttendanceByDate]);

  const handleCheckChange = (studentId: string, checked: boolean) => {
    setCheckedByStudentId((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }

    if (classStudents.length === 0) {
      toast.error("No active students in this class");
      return;
    }

    try {
      await takeAttendance({
        classId: selectedClassId,
        date: selectedDate,
        records: classStudents.map((student) => ({
          studentId: student._id,
          status: checkedByStudentId[student._id] ? "present" : "absent",
        })),
      }).unwrap();
      toast.success("Attendance saved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save attendance");
    }
  };

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isClassesLoading || isStudentsLoading) {
    return <div>Loading attendance...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Take class attendance by date and track attendance history.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4 sm:p-6 space-y-4">
        <div className="flex justify-end">
          <Button
            variant={showAttendanceForm ? "outline" : "default"}
            onClick={() => setShowAttendanceForm((prev) => !prev)}
          >
            {showAttendanceForm ? "Hide Attendance Form" : "Take Attendance"}
          </Button>
        </div>

        {showAttendanceForm ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendance-class">Class</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger id="attendance-class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesData?.data.map((classItem) => (
                      <SelectItem key={classItem._id} value={classItem._id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendance-date">Date</Label>
                <Input
                  id="attendance-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>
            </div>

            {!selectedClassId ? (
              <div className="text-sm text-muted-foreground">Select a class to start attendance.</div>
            ) : classStudents.length === 0 ? (
              <div className="text-sm text-muted-foreground">No active students in this class.</div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Present</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student) => (
                        <tr key={student._id} className="border-b last:border-b-0">
                          <td className="px-4 py-3">{getDisplayName(student)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="h-5 w-5 cursor-pointer accent-blue-600"
                                checked={Boolean(checkedByStudentId[student._id])}
                                onChange={(event) =>
                                  handleCheckChange(student._id, event.target.checked)
                                }
                              />
                              <span className="text-xs text-muted-foreground">
                                {checkedByStudentId[student._id] ? "Present" : "Absent"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  onClick={handleSaveAttendance}
                  disabled={isSavingAttendance || isLoadingExistingAttendance}
                >
                  {isSavingAttendance ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            )}
          </>
        ) : null}
      </div>

      {selectedClassId ? (
        <div className="rounded-lg border bg-white p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Attendance History</h2>
          {isHistoryLoading ? (
            <div>Loading attendance history...</div>
          ) : !historyData?.data?.length ? (
            <div className="text-sm text-muted-foreground">No attendance history found.</div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Present</th>
                    <th className="px-4 py-3 text-left">Absent</th>
                    <th className="px-4 py-3 text-left">Taken By</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.data.map((entry) => {
                    const counters = entry.records.reduce(
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

                    const takenByName =
                      typeof entry.takenBy === "string" ? "-" : entry.takenBy.name;

                    return (
                      <tr key={entry._id} className="border-b last:border-b-0">
                        <td className="px-4 py-3">{entry.date}</td>
                        <td className="px-4 py-3">{counters.present}</td>
                        <td className="px-4 py-3">{counters.absent}</td>
                        <td className="px-4 py-3">{takenByName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
