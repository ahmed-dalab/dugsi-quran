import { useAppSelector } from "@/app/hooks";
import { ListPageSkeleton } from "@/components/skeletons";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetUsersQuery } from "../api/userApi";
import UsersTable from "../components/UsersTable";
import CreateUserDialog from "../components/CreateUserDialog";

export default function Users() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetUsersQuery(params, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping || isLoading) {
    return <ListPageSkeleton columns={6} />;
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

      <ListSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name or email..."
      />

      {!data || data.data.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <UsersTable users={data.data} />
      )}

      <TablePagination
        pagination={data?.pagination}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}
