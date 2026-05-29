import { ChartCardSkeleton } from "./chart-card-skeleton";
import { MetricCardSkeleton } from "./metric-card-skeleton";
import { PageHeaderSkeleton } from "./page-header-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCardSkeleton variant="pie" />
        <ChartCardSkeleton variant="pie" />
      </div>

      <ChartCardSkeleton variant="bar" />

      <ChartCardSkeleton variant="bar" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
