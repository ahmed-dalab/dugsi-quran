import AdminListPage from "@/components/common/AdminListPage";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetUsersQuery } from "../api/userApi";
import UsersTable from "../components/UsersTable";
import CreateUserDialog from "../components/CreateUserDialog";

export default function Users() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetUsersQuery(params, { skip });

  return (
    <AdminListPage
      title="Users"
      description="Manage system users here."
      action={<CreateUserDialog />}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search by name or email...",
      }}
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load users."
      emptyMessage="No users found."
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={6}
    >
      {data && data.data.length > 0 ? <UsersTable users={data.data} /> : null}
    </AdminListPage>
  );
}
