import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/pagination";

interface TablePaginationProps {
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function TablePagination({
  pagination,
  onPageChange,
  isLoading = false,
}: TablePaginationProps) {
  if (!pagination || pagination.totalDocs === 0) {
    return null;
  }

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.totalDocs);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {pagination.totalDocs}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasPrevPage || isLoading}
          onClick={() => onPageChange(pagination.prevPage ?? pagination.page - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasNextPage || isLoading}
          onClick={() => onPageChange(pagination.nextPage ?? pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
