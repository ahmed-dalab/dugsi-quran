import { Skeleton } from "@/components/ui/skeleton";
import { tableShellClass } from "@/design-system/nav";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
  variant?: "list" | "inline";
}

export function TableSkeleton({
  columns = 5,
  rows = 6,
  className,
  variant = "list",
}: TableSkeletonProps) {
  const shellClass =
    variant === "inline"
      ? "overflow-hidden rounded-lg border border-border bg-card"
      : tableShellClass;

  return (
    <div className={cn(shellClass, className)}>
      <div className="border-b bg-muted/50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-4 py-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn("h-4 flex-1", colIndex === 0 && "max-w-[140px]")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
