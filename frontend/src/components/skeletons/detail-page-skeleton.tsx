import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./table-skeleton";

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <Card className="p-4 sm:p-6">
        <Skeleton className="mb-4 h-6 w-44" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-md border p-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full max-w-[200px]" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <Skeleton className="mb-4 h-6 w-44" />
        <TableSkeleton columns={4} rows={4} variant="inline" />
      </Card>
    </div>
  );
}
