import type { Student } from "../types/student.types";
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
          <div key={student._id} className="rounded-lg border bg-background p-4">
            <div className="space-y-1">
              <p className="font-medium">{student.fullName}</p>
              <p className="text-sm text-muted-foreground">{student.guardianPhone}</p>
              <p className="text-sm text-muted-foreground">
                Class: {getClassName(student.classId)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {student.gender}
              </span>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  student.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {student.status}
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              <EditStudentDialog student={student} triggerClassName="w-full justify-start" />
              <DeleteStudentDialog student={student} triggerClassName="w-full justify-start" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden rounded-lg border bg-white md:block">
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
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {student.status}
                  </span>
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
