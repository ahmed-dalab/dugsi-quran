import { useAppSelector } from "@/app/hooks";
import { useGetUsersQuery } from "../api/userApi";
import UsersTable from "../components/UsersTable";
import CreateUserDialog from "../components/CreateUserDialog";

export default function Users() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetUsersQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Failed to load users.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage system users here.
          </p>
        </div>

        <CreateUserDialog />
      </div>

      {!data || data.data.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <UsersTable users={data.data} />
      )}
    </div>
  );
}
