import AdminListPage from "@/components/common/AdminListPage";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetStudentsQuery } from "../api/studentApi";
import CreateStudentDialog from "../components/CreateStudentDialog";
import StudentsTable from "../components/StudentsTable";

export default function Students() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetStudentsQuery(params, { skip });

  return (
    <AdminListPage
      title="Students"
      description="Manage student records and class assignments."
      action={<CreateStudentDialog />}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search by name, guardian, or phone...",
      }}
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load students."
      emptyMessage="No students found."
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={6}
    >
      {data && data.data.length > 0 ? <StudentsTable students={data.data} /> : null}
    </AdminListPage>
  );
}
