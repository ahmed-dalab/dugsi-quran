import AdminListPage from "@/components/common/AdminListPage";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import CreateClassDialog from "../components/CreateClassDialog";
import ClassesTable from "../components/ClassesTable";
import { useGetClassesQuery } from "../api/classApi";

export default function Classes() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetClassesQuery(params, { skip });

  return (
    <AdminListPage
      title="Classes"
      description="Manage classes, level order, and monthly fees."
      action={<CreateClassDialog />}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search by class name...",
      }}
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load classes."
      emptyMessage="No classes found."
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={5}
    >
      {data && data.data.length > 0 ? <ClassesTable classes={data.data} /> : null}
    </AdminListPage>
  );
}
