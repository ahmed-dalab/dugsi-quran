import AdminListPage from "@/components/common/AdminListPage";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetFeesQuery } from "../api/feeApi";
import CreateFeeDialog from "../components/CreateFeeDialog";
import FeesTable from "../components/FeesTable";

export default function Fees() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
  const { search, setSearch, params, setPage } = useListQueryState();

  const { data, isLoading, isError, isFetching } = useGetFeesQuery(params, { skip });

  return (
    <AdminListPage
      title="Fees"
      description="Track monthly student fee payments."
      action={<CreateFeeDialog />}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search fees...",
      }}
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load fee records."
      emptyMessage="No fee records found."
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={7}
    >
      {data && data.data.length > 0 ? <FeesTable fees={data.data} /> : null}
    </AdminListPage>
  );
}
