import { useEffect, useMemo, useState } from "react";

import { DEFAULT_PAGE_SIZE, type ListQueryParams } from "@/lib/pagination";

export function useListQueryState(extraParams?: Omit<ListQueryParams, "page" | "limit" | "search">) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const params = useMemo<ListQueryParams>(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      ...extraParams,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [page, debouncedSearch, extraParams]
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    params,
  };
}
