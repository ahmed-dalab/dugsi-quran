import { Skeleton } from "@/components/ui/skeleton";

/** Lightweight skeleton while auth session is bootstrapping. */
export function SessionSkeleton() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-56 max-w-full" />
    </div>
  );
}
