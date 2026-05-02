import type { Teacher } from "../types/teacher.types";
import DeleteTeacherDialog from "./DeleteTeacherDialog";
import EditTeacherDialog from "./EditTeacherDialog";
import ViewTeacherDialog from "./ViewTeacherDialog";
import AssignClassDialog from "@/features/admin/assignments/components/AssignClassDialog";
import { useGetCurrentAssignmentForTeacherQuery } from "@/features/admin/assignments/api/assignmentApi";

interface TeachersTableProps {
  teachers: Teacher[];
}

const getUserName = (userId: Teacher["userId"]) =>
  typeof userId === "string" ? userId : (userId as any).name;

const getUserEmail = (userId: Teacher["userId"]) =>
  typeof userId === "string" ? "" : (userId as any).email;

const getClassName = (classId: any) => {
  if (typeof classId === "string") return "Unknown Class";
  return classId?.name || "Unknown Class";
};

function TeacherRow({ teacher }: { teacher: Teacher }) {
  const { data: currentAssignment } = useGetCurrentAssignmentForTeacherQuery(teacher._id);
  const teacherName = getUserName(teacher.userId);

  return (
    <>
      {/* Mobile view */}
      <div key={teacher._id} className="rounded-lg border bg-background p-4 md:hidden">
        <div className="space-y-1">
          <p className="font-medium">{teacherName}</p>
          <p className="text-sm text-muted-foreground">{getUserEmail(teacher.userId)}</p>
          {teacher.phone && (
            <p className="text-sm text-muted-foreground">{teacher.phone}</p>
          )}
          {currentAssignment?.data && (
            <p className="text-sm text-muted-foreground">
              Class: {getClassName(currentAssignment.data.classId)}
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {teacher.gender && (
            <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {teacher.gender}
            </span>
          )}
          {currentAssignment?.data && (
            <span className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Assigned
            </span>
          )}
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              teacher.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {teacher.status}
          </span>
        </div>

        <div className="mt-4 grid gap-2">
          <AssignClassDialog triggerClassName="w-full justify-start" />
          <ViewTeacherDialog teacher={teacher} triggerClassName="w-full justify-start" />
          <EditTeacherDialog teacher={teacher} triggerClassName="w-full justify-start" />
          <DeleteTeacherDialog teacher={teacher} triggerClassName="w-full justify-start" />
        </div>
      </div>

      {/* Desktop view */}
      <tr key={teacher._id} className="border-b last:border-b-0 hidden md:table-row">
        <td className="px-4 py-3 font-medium">{teacherName}</td>
        <td className="px-4 py-3">{getUserEmail(teacher.userId)}</td>
        <td className="px-4 py-3">{teacher.phone || "-"}</td>
        <td className="px-4 py-3">
          {currentAssignment?.data ? (
            <span className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {getClassName(currentAssignment.data.classId)}
            </span>
          ) : (
            <span className="text-muted-foreground">Not assigned</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              teacher.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {teacher.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <AssignClassDialog />
            <ViewTeacherDialog teacher={teacher} />
            <EditTeacherDialog teacher={teacher} />
            <DeleteTeacherDialog teacher={teacher} />
          </div>
        </td>
      </tr>
    </>
  );
}

export default function TeachersTable({ teachers }: TeachersTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {teachers.map((teacher) => (
          <TeacherRow key={teacher._id} teacher={teacher} />
        ))}
      </div>

      <div className="hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Current Class</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <TeacherRow key={teacher._id} teacher={teacher} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
