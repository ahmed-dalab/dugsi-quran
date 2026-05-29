import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "./page-header-skeleton";
import { TableSkeleton } from "./table-skeleton";

interface ListPageSkeletonProps {
  withAction?: boolean;
  columns?: number;
  rows?: number;
}

export function ListPageSkeleton({
  withAction = true,
  columns = 5,
  rows = 8,
}: ListPageSkeletonProps) {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton withAction={withAction} />
      <Skeleton className="h-10 w-full max-w-md rounded-xl" />
      <TableSkeleton columns={columns} rows={rows} />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
