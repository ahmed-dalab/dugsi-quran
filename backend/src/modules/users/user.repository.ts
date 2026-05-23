import type { Prisma, UserRole } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { buildPaginationMeta, getPrismaPaginationArgs } from "../../utils/prismaPagination";

export const userRepository = {
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async findPaginated(pagination: PaginationQuery, filters: { role?: UserRole; isActive?: boolean }) {
    const where: Prisma.UserWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["name", "email"]),
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    };

    const orderBy = { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder } as Prisma.UserOrderByWithRelationInput;

    const [docs, totalDocs] = await Promise.all([
      prisma.user.findMany({
        where,
        ...getPrismaPaginationArgs(pagination),
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { docs, pagination: buildPaginationMeta(totalDocs, pagination) };
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  count() {
    return prisma.user.count();
  },
};
