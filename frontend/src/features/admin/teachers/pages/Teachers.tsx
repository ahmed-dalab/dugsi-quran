import { useAppSelector } from "@/app/hooks";
import { ListPageSkeleton } from "@/components/skeletons";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetTeachersQuery } from "../api/teacherApi";
import CreateTeacherDialog from "../components/CreateTeacherDialog";
import TeachersTable from "../components/TeachersTable";

export default function Teachers() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetTeachersQuery(params, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping || isLoading) {
    return <ListPageSkeleton columns={6} />;
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

      <ListSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, phone..."
      />

      {!data || data.data.length === 0 ? (
        <div>No teachers found.</div>
      ) : (
        <TeachersTable teachers={data.data} />
      )}

      <TablePagination
        pagination={data?.pagination}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}
