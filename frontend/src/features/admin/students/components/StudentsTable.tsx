import type { Student } from "../types/student.types";
import { StatusBadge } from "@/components/ui/status-badge";
import { panelClass, tableShellClass } from "@/design-system/nav";
import DeleteStudentDialog from "./DeleteStudentDialog";
import EditStudentDialog from "./EditStudentDialog";

interface StudentsTableProps {
  students: Student[];
}

const getClassName = (classId: Student["classId"]) =>
  typeof classId === "string" ? classId : classId.name;

export default function StudentsTable({ students }: StudentsTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {students.map((student) => (
          <div key={student._id} className={panelClass}>
            <div className="space-y-1">
              <p className="font-medium">{student.fullName}</p>
              <p className="text-sm text-muted-foreground">{student.guardianPhone}</p>
              <p className="text-sm text-muted-foreground">
                Class: {getClassName(student.classId)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge preset={student.gender} />
              <StatusBadge preset={student.status === "active" ? "active" : "inactive"} />
            </div>

            <div className="mt-4 grid gap-2">
              <EditStudentDialog student={student} triggerClassName="w-full justify-start" />
              <DeleteStudentDialog student={student} triggerClassName="w-full justify-start" />
            </div>
          </div>
        ))}
      </div>

      <div className={tableShellClass}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Guardian Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{student.fullName}</td>
                <td className="px-4 py-3">{getClassName(student.classId)}</td>
                <td className="px-4 py-3 capitalize">{student.gender}</td>
                <td className="px-4 py-3">{student.guardianPhone}</td>
                <td className="px-4 py-3">
                  <StatusBadge preset={student.status === "active" ? "active" : "inactive"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <EditStudentDialog student={student} />
                    <DeleteStudentDialog student={student} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
