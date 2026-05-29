import type { PaginationQuery } from "./pagination";
import { buildPaginationMeta, getPrismaPaginationArgs } from "./prismaPagination";

type PaginateQueryConfig<TDoc> = {
  findMany: (args: { skip: number; take: number }) => Promise<TDoc[]>;
  count: () => Promise<number>;
  pagination: PaginationQuery;
};

export async function paginateQuery<TDoc>(config: PaginateQueryConfig<TDoc>) {
  const { skip, take } = getPrismaPaginationArgs(config.pagination);

  const [docs, totalDocs] = await Promise.all([
    config.findMany({ skip, take }),
    config.count(),
  ]);

  return {
    docs,
    pagination: buildPaginationMeta(totalDocs, config.pagination),
  };
}
