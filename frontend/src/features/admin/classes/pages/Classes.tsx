import { useAppSelector } from "@/app/hooks";
import CreateClassDialog from "../components/CreateClassDialog";
import ClassesTable from "../components/ClassesTable";
import { useGetClassesQuery } from "../api/classApi";

export default function Classes() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetClassesQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading classes...</div>;
  }

  if (isError) {
    return <div>Failed to load classes.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Classes</h1>
          <p className="text-sm text-muted-foreground">
            Manage classes, level order, and monthly fees.
          </p>
        </div>

        <CreateClassDialog />
      </div>

      {!data || data.data.length === 0 ? (
        <div>No classes found.</div>
      ) : (
        <ClassesTable classes={data.data} />
      )}
    </div>
  );
}
