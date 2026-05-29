import { useAppSelector } from "@/app/hooks";
import { ListPageSkeleton } from "@/components/skeletons";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import { useListQueryState } from "@/hooks/useListQueryState";
import CreateClassDialog from "../components/CreateClassDialog";
import ClassesTable from "../components/ClassesTable";
import { useGetClassesQuery } from "../api/classApi";

export default function Classes() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetClassesQuery(params, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping || isLoading) {
    return <ListPageSkeleton columns={5} />;
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

      <ListSearch value={search} onChange={setSearch} placeholder="Search by class name..." />

      {!data || data.data.length === 0 ? (
        <div>No classes found.</div>
      ) : (
        <ClassesTable classes={data.data} />
      )}

      <TablePagination
        pagination={data?.pagination}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}
