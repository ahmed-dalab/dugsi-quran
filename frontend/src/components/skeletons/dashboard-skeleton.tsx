import { ChartCardSkeleton } from "./chart-card-skeleton";
import { MetricCardSkeleton } from "./metric-card-skeleton";
import { PageHeaderSkeleton } from "./page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCardSkeleton rows={2} />
        <ChartCardSkeleton rows={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex h-14 items-end gap-2">
                  <Skeleton className="h-full flex-1 rounded-t-sm" />
                  <Skeleton className="h-3/4 flex-1 rounded-t-sm" />
                </div>
              ))}
            </div>
          </div>
        </Card>
        <ChartCardSkeleton rows={5} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
