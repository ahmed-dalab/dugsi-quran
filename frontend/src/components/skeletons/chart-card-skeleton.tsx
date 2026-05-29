import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardSkeletonProps {
  rows?: number;
  variant?: "default" | "pie" | "bar";
}

export function ChartCardSkeleton({ rows = 4, variant = "default" }: ChartCardSkeletonProps) {
  if (variant === "pie") {
    return (
      <Card className="p-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
            <Skeleton className="h-48 w-48 rounded-full" />
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-20" />
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "bar") {
    return (
      <Card className="p-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <div className="flex h-[320px] items-end justify-between gap-3 px-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full rounded-t-md"
                style={{ height: `${40 + (index % 3) * 20}%` }}
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
