import type { Teacher } from "../types/teacher.types";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { panelClass, tableShellClass } from "@/design-system/nav";
import DeleteTeacherDialog from "./DeleteTeacherDialog";
import EditTeacherDialog from "./EditTeacherDialog";
import ViewTeacherDialog from "./ViewTeacherDialog";
import AssignClassDialog from "@/features/admin/assignments/components/AssignClassDialog";
import { useGetCurrentAssignmentForTeacherQuery } from "@/features/admin/assignments/api/assignmentApi";
import { cn } from "@/lib/utils";

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
      <div key={teacher._id} className={cn(panelClass, "md:hidden")}>
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
          {teacher.gender ? <StatusBadge preset={teacher.gender} /> : null}
          {currentAssignment?.data ? <Badge variant="success">Assigned</Badge> : null}
          <StatusBadge preset={teacher.status === "active" ? "active" : "inactive"} />
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
            <Badge variant="success">{getClassName(currentAssignment.data.classId)}</Badge>
          ) : (
            <span className="text-muted-foreground">Not assigned</span>
          )}
        </td>
        <td className="px-4 py-3">
          <StatusBadge preset={teacher.status === "active" ? "active" : "inactive"} />
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

      <div className={tableShellClass}>
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
