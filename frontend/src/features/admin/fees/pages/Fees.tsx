import { useAppSelector } from "@/app/hooks";
import { useGetFeesQuery } from "../api/feeApi";
import CreateFeeDialog from "../components/CreateFeeDialog";
import FeesTable from "../components/FeesTable";

export default function Fees() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetFeesQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading fee records...</div>;
  }

  if (isError) {
    return <div>Failed to load fee records.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Fees</h1>
          <p className="text-sm text-muted-foreground">
            Track monthly student fee payments.
          </p>
        </div>

        <CreateFeeDialog />
      </div>

      {!data || data.data.length === 0 ? <div>No fee records found.</div> : <FeesTable fees={data.data} />}
    </div>
  );
}
