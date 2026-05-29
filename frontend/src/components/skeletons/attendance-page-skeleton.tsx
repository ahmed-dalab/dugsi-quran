import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "./page-header-skeleton";
import { TableSkeleton } from "./table-skeleton";

export function AttendancePageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton withAction={false} />

      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <TableSkeleton columns={2} rows={6} />
      </Card>

      <Card className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <TableSkeleton columns={3} rows={5} />
      </Card>
    </div>
  );
}
