import { useAppSelector } from "@/app/hooks";
import { useGetStudentsQuery } from "../api/studentApi";
import CreateStudentDialog from "../components/CreateStudentDialog";
import StudentsTable from "../components/StudentsTable";

export default function Students() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetStudentsQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  if (isError) {
    return <div>Failed to load students.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">
            Manage student records and class assignments.
          </p>
        </div>

        <CreateStudentDialog />
      </div>

      {!data || data.data.length === 0 ? (
        <div>No students found.</div>
      ) : (
        <StudentsTable students={data.data} />
      )}
    </div>
  );
}
