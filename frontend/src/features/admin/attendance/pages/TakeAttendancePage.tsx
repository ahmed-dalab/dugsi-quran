import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSelect } from "@/components/ui/select";
import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useGetStudentsQuery } from "@/features/admin/students/api/studentApi";
import { getApiErrorMessage, logDevError } from "@/lib/apiError";
import { LIST_ALL_PARAMS } from "@/lib/pagination";
import { PATHS } from "@/router/paths";
import type { Student } from "@/features/admin/students/types/student.types";
import {
  useLazyGetAttendanceByClassAndDateQuery,
  useTakeAttendanceMutation,
} from "../api/attendanceApi";

const today = new Date().toISOString().slice(0, 10);

const getDisplayName = (student: Student) => student.fullName;

export default function TakeAttendancePage() {
  const navigate = useNavigate();
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [checkedByStudentId, setCheckedByStudentId] = useState<Record<string, boolean>>({});

  const { data: classesData, isLoading: isClassesLoading } = useGetClassesQuery(LIST_ALL_PARAMS, {
    skip: isBootstrapping || !accessToken,
  });

  const studentListParams = selectedClassId
    ? { ...LIST_ALL_PARAMS, classId: selectedClassId, status: "active" as const }
    : undefined;

  const { data: studentsData, isLoading: isStudentsLoading } = useGetStudentsQuery(
    studentListParams!,
    {
      skip: isBootstrapping || !accessToken || !studentListParams,
    }
  );

  const [fetchAttendanceByDate, { isFetching: isLoadingExistingAttendance }] =
    useLazyGetAttendanceByClassAndDateQuery();
  const [takeAttendance, { isLoading: isSavingAttendance }] = useTakeAttendanceMutation();

  const classStudents = studentsData?.data ?? [];

  const classOptions = useMemo(
    () =>
      classesData?.data.map((classItem) => ({
        value: classItem._id,
        label: classItem.name,
      })) ?? [],
    [classesData?.data]
  );

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
      navigate(PATHS.adminAttendance);
    } catch (error: unknown) {
      logDevError("Save attendance failed", error);
      toast.error(getApiErrorMessage(error, "Failed to save attendance"));
    }
  };

  if (isBootstrapping || isClassesLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Take Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Select a class and date, then mark each student as present or absent.
          </p>
        </div>

        <Button variant="outline" asChild className="gap-2">
          <Link to={PATHS.adminAttendance}>
            <ArrowLeft className="h-4 w-4" />
            Back to Attendance
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="take-attendance-class">Class</Label>
            <AppSelect
              id="take-attendance-class"
              value={selectedClassId || null}
              onChange={(value) => setSelectedClassId(value ?? "")}
              placeholder="Search and select class"
              isLoading={isClassesLoading}
              options={classOptions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="take-attendance-date">Date</Label>
            <Input
              id="take-attendance-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
        </div>

        {!selectedClassId ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Select a class to load students.
          </div>
        ) : isStudentsLoading || isLoadingExistingAttendance ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Loading students...
          </div>
        ) : classStudents.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No active students in this class.
          </div>
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
                            className="h-5 w-5 cursor-pointer accent-primary"
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

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" asChild>
                <Link to={PATHS.adminAttendance}>Cancel</Link>
              </Button>
              <Button onClick={handleSaveAttendance} disabled={isSavingAttendance}>
                {isSavingAttendance ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
