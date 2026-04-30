import { useAppSelector } from "@/app/hooks";
import { useGetTeachersQuery } from "../api/teacherApi";
import CreateTeacherDialog from "../components/CreateTeacherDialog";
import TeachersTable from "../components/TeachersTable";

export default function Teachers() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetTeachersQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading teachers...</div>;
  }

  if (isError) {
    return <div>Failed to load teachers.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage teacher accounts and information.
          </p>
        </div>

        <CreateTeacherDialog />
      </div>

      {!data || data.data.length === 0 ? (
        <div>No teachers found.</div>
      ) : (
        <TeachersTable teachers={data.data} />
      )}
    </div>
  );
}
