import type { Prisma } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { paginateQuery } from "../../utils/prismaRepository";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";

export const classRepository = {
  create(data: Prisma.ClassCreateInput) {
    return prisma.class.create({ data });
  },

  async findPaginated(pagination: PaginationQuery, filters: { isActive?: boolean }) {
    const where: Prisma.ClassWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["name"]),
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    };

    const orderBy = {
      [pagination.sortBy ?? "levelOrder"]: pagination.sortOrder,
    } as Prisma.ClassOrderByWithRelationInput;

    return paginateQuery({
      findMany: ({ skip, take }) => prisma.class.findMany({ where, skip, take, orderBy }),
      count: () => prisma.class.count({ where }),
      pagination,
    });
  },

  findById(id: string) {
    return prisma.class.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.ClassUpdateInput) {
    return prisma.class.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.class.delete({ where: { id } });
  },

  count() {
    return prisma.class.count();
  },
};
