import type { ReactNode } from "react";

import { ListPageSkeleton } from "@/components/skeletons";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import type { PaginationMeta } from "@/types/pagination";

type AdminListPageProps = {
  title: string;
  description: string;
  action?: ReactNode;
  filters?: ReactNode;
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  };
  pagination?: {
    meta: PaginationMeta | undefined;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
  };
  isBootstrapping?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  skeletonColumns?: number;
  emptyMessage?: ReactNode;
  isEmpty?: boolean;
  children: ReactNode;
};

export default function AdminListPage({
  title,
  description,
  action,
  filters,
  search,
  pagination,
  isBootstrapping = false,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load data.",
  skeletonColumns = 5,
  emptyMessage = "No records found.",
  isEmpty = false,
  children,
}: AdminListPageProps) {
  if (isBootstrapping || isLoading) {
    return <ListPageSkeleton columns={skeletonColumns} />;
  }

  if (isError) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {action}
      </div>

      {filters ? (
        filters
      ) : (
        <ListSearch value={search.value} onChange={search.onChange} placeholder={search.placeholder} />
      )}

      {isEmpty ? <div>{emptyMessage}</div> : children}

      {pagination ? (
        <TablePagination
          pagination={pagination.meta}
          onPageChange={pagination.onPageChange}
          isLoading={pagination.isLoading}
        />
      ) : null}
    </div>
  );
}
