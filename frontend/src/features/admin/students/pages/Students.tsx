import { useAppSelector } from "@/app/hooks";
import { ListPageSkeleton } from "@/components/skeletons";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetStudentsQuery } from "../api/studentApi";
import CreateStudentDialog from "../components/CreateStudentDialog";
import StudentsTable from "../components/StudentsTable";

export default function Students() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetStudentsQuery(params, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping || isLoading) {
    return <ListPageSkeleton columns={6} />;
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

      <ListSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name, guardian, or phone..."
      />

      {!data || data.data.length === 0 ? (
        <div>No students found.</div>
      ) : (
        <StudentsTable students={data.data} />
      )}

      <TablePagination
        pagination={data?.pagination}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}
