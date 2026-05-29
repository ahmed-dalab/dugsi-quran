import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PageHeaderSkeletonProps {
  withAction?: boolean;
  className?: string;
}

export function PageHeaderSkeleton({ withAction = false, className }: PageHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {withAction ? <Skeleton className="h-10 w-36 rounded-lg" /> : null}
    </div>
  );
}
