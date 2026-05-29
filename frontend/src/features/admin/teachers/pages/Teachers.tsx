import AdminListPage from "@/components/common/AdminListPage";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetTeachersQuery } from "../api/teacherApi";
import CreateTeacherDialog from "../components/CreateTeacherDialog";
import TeachersTable from "../components/TeachersTable";

export default function Teachers() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetTeachersQuery(params, { skip });

  return (
    <AdminListPage
      title="Teachers"
      description="Manage teacher accounts and information."
      action={<CreateTeacherDialog />}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search by name, email, phone...",
      }}
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load teachers."
      emptyMessage="No teachers found."
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={6}
    >
      {data && data.data.length > 0 ? <TeachersTable teachers={data.data} /> : null}
    </AdminListPage>
  );
}
